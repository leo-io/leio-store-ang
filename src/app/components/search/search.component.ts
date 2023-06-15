import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private router: Router) {

  }

  doSearch(value: string): void { 
    console.log(`product search=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }  

}
