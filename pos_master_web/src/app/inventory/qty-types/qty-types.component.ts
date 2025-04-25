import { Component } from '@angular/core';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-qty-types',
  templateUrl: './qty-types.component.html',
  styleUrl: './qty-types.component.scss'
})
export class QtyTypesComponent {

  name: string | undefined;
  items: any[] | undefined;


  primaryToThisWeight: string | undefined;

  value3: string | undefined;

  search(event: AutoCompleteCompleteEvent) {
    let _items = [...Array(10).keys()];

    this.items = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
  }

}
