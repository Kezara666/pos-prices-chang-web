import { ChangeDetectorRef, Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InvoiceDto } from '../../../models/purchase-order/purchase-order.dto';
import { InvoiceService } from '../../sale-management/purchase-order/invoice.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-stat-management',
  templateUrl: './stat-management.component.html',
  styleUrl: './stat-management.component.scss'
})
export class StatManagementComponent {

  totalSales: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  averageOrderValue: number = 0;
  monthlySales: number = 0;
  totalProfit: number = 0;
  profitMargin: number = 0;
  showCurrentMonthOnly: boolean = true;
  chartViewMode: 'currentMonth' | 'allTime' | 'monthly' = 'currentMonth';
  
  // Line Chart
  basicData: any;

  // Bar Chart
  barData: any;

  // Pie Chart
  pieData: any;

  // Options for consistent theming
  chartOptions: any;
  pieChartOptions: any;

  purchaseOrders: InvoiceDto[] = [];
  displayInvoiceDetailsDialog: boolean = false;
  selectedInvoice: InvoiceDto | null = null;
  topProducts: { name: string; unitsSold: number; revenue: number }[] = [];


  constructor(private invoiceService: InvoiceService, private cdRef: ChangeDetectorRef) {

    this.initChartOptions();
    this.initPieChartOptions();

  }


  ngAfterViewInit(): void {
    this.loadPurchaseOrders();

  }



  loadPurchaseOrders(): void {
    this.invoiceService.getInvoices().subscribe(
      (data) => {
        this.purchaseOrders = data;
        console.log(data);
        this.calculateStatistics();
        this.initLineChartFromInvoices(this.purchaseOrders);
        this.initBarChartFromInvoices(this.purchaseOrders);
        this.initPieChart(this.purchaseOrders);
        this.calculateTopProducts();
        // Ensure the view updates with new data
      },
      (error) => {
        console.error('Failed to load purchase orders', error);
      }
    );
  }

  calculateStatistics(): void {
    // Calculate total sales
    this.totalSales = this.purchaseOrders.reduce((sum, order) => sum + order.netTotal, 0);
    
    // Calculate total orders
    this.totalOrders = this.purchaseOrders.length;
    
    // Calculate unique customers
    const uniqueCustomers = new Set(this.purchaseOrders.map(order => order.customerId).filter(id => id !== undefined));
    this.totalCustomers = uniqueCustomers.size;
    
    // Calculate average order value
    this.averageOrderValue = this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0;
    
    // Calculate monthly sales (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.monthlySales = this.purchaseOrders
      .filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.netTotal, 0);

    // Calculate profit and profit margin
    this.calculateProfitMetrics();
  }

  calculateTopProducts(): void {
    const productMap = new Map<string, { unitsSold: number; revenue: number }>();

    for (const invoice of this.purchaseOrders) {
      for (const item of invoice.itemsSelled || []) {
        const productName = item.product?.name || 'Unknown Product';
        const qty = item.qty || 0;
        const revenue = (item.productPrice?.primarySalePrice || 0) * qty;

        const existing = productMap.get(productName) || { unitsSold: 0, revenue: 0 };
        productMap.set(productName, {
          unitsSold: existing.unitsSold + qty,
          revenue: existing.revenue + revenue
        });
      }
    }

    // Convert to array and sort by units sold
    this.topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10); // Top 10 products
  }

  calculateProfitMetrics(): void {
    let totalCost = 0;
    let totalRevenue = 0;

    for (const invoice of this.purchaseOrders) {
      for (const item of invoice.itemsSelled || []) {
        const revenue = (item.productPrice?.primarySalePrice || 0) * (item.qty || 0);
        totalRevenue += revenue;

        // Try to get cost from product price data
        const cost = item.productPrice!.broughtPrice;
        totalCost += cost * (item.qty || 0);
      }
    }

    this.totalProfit = totalRevenue - totalCost;
    this.profitMargin = totalRevenue > 0 ? (this.totalProfit / totalRevenue) * 100 : 0;
  }


  initLineChartFromInvoices(invoices: InvoiceDto[]) {
    const salesData = new Map<string, number>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter invoices based on the chart view mode
    let filteredInvoices = invoices;
    if (this.chartViewMode === 'currentMonth') {
      filteredInvoices = invoices.filter(invoice => {
        if (!invoice.createdAt) return false;
        const invoiceDate = new Date(invoice.createdAt);
        return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
      });
    }

    for (const invoice of filteredInvoices) {
      if (invoice.createdAt) {
        const invoiceDate = dayjs(invoice.createdAt);
        let key: string;
        
        switch (this.chartViewMode) {
          case 'currentMonth':
            key = invoiceDate.format('DD'); // Just day number for current month
            break;
          case 'monthly':
            key = invoiceDate.format('MMM YYYY'); // Month and year
            break;
          case 'allTime':
          default:
            key = invoiceDate.format('MMM DD'); // Month and day for all time
            break;
        }

        const current = salesData.get(key) || 0;
        salesData.set(key, current + invoice.netTotal);
      }
    }

    // Sort by date
    const sortedKeys = Array.from(salesData.keys()).sort((a, b) => {
      switch (this.chartViewMode) {
        case 'currentMonth':
          return parseInt(a) - parseInt(b); // Sort by day number
        case 'monthly':
          return dayjs(a, 'MMM YYYY').valueOf() - dayjs(b, 'MMM YYYY').valueOf(); // Sort by month
        case 'allTime':
        default:
          return dayjs(a, 'MMM DD').valueOf() - dayjs(b, 'MMM DD').valueOf(); // Sort by date
      }
    });
    const data = sortedKeys.map(key => salesData.get(key) || 0);

    let label = '';
    switch (this.chartViewMode) {
      case 'currentMonth':
        label = 'Daily Sales (Current Month)';
        break;
      case 'monthly':
        label = 'Monthly Sales';
        break;
      case 'allTime':
      default:
        label = 'Daily Sales (All Time)';
        break;
    }

    this.basicData = {
      labels: sortedKeys,
      datasets: [
        {
          label: label,
          data: data,
          fill: false,
          borderColor: getThemeColor('--p-primary-500'),
          backgroundColor: getThemeColor('--p-primary-500'),
          tension: 0.4
        }
      ]
    };
  }

  setChartView(mode: 'currentMonth' | 'allTime' | 'monthly'): void {
    this.chartViewMode = mode;
    this.initLineChartFromInvoices(this.purchaseOrders);
  }



  initBarChartFromInvoices(invoices: InvoiceDto[]) {
    const categoryMap = new Map<string, number>();

    for (const invoice of invoices) {
      for (const item of invoice.itemsSelled || []) {
        const category = item.product?.category ?? 'Unknown';
        const qty = item.qty ?? 0;

        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + qty);
      }
    }
    console.log(categoryMap);

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    // Initialize pie chart data
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Units Sold',
          backgroundColor: getThemeColor('--p-primary-500'),
          borderColor: getThemeColor('--p-primary-700'),
          data: data
        }
      ]
    };
  }


  initPieChart(invoices: InvoiceDto[]) {
    const categoryMap = new Map<string, { units: number; revenue: number }>();

    for (const invoice of invoices) {
      for (const item of invoice.itemsSelled || []) {
        const category = item.product?.category ?? 'Unknown';
        const qty = item.qty ?? 0;
        const revenue = (item.productPrice?.primarySalePrice || 0) * qty;

        const current = categoryMap.get(category) || { units: 0, revenue: 0 };
        categoryMap.set(category, {
          units: current.units + qty,
          revenue: current.revenue + revenue
        });
      }
    }
    console.log('Category Map:', categoryMap);

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values()).map(item => item.revenue); // Use revenue instead of units

    // Generate dynamic colors for any number of categories
    const colors = this.generateChartColors(labels.length);

    this.pieData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors.background,
          hoverBackgroundColor: colors.hover,
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }

  generateChartColors(count: number): { background: string[], hover: string[] } {
    const baseColors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316', // Orange
      '#EC4899', // Pink
      '#6B7280', // Gray
      '#14B8A6', // Teal
      '#A855F7'  // Violet
    ];

    const background: string[] = [];
    const hover: string[] = [];

    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      const baseColor = baseColors[colorIndex];
      background.push(baseColor);
      
      // Create a slightly lighter hover color
      hover.push(this.lightenColor(baseColor, 20));
    }

    return { background, hover };
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  initChartOptions() {
    const textColor = getThemeColor('--text-color');
    const gridColor = getThemeColor('--surface-border');

    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    };
  }

  initPieChartOptions() {
    const textColor = getThemeColor('--text-color');

    this.pieChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#ffffff',
          borderWidth: 1,
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: Rs.${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    };
  }
}

// Helper function to read theme colors
function getThemeColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}