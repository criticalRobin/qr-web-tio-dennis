import { Component } from '@angular/core';

@Component({
  selector: 'qr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  protected menuList: string[] = [];
  protected isExpanded: boolean = true;
}
