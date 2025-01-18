import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@/shared/components/navbar/navbar.component';
import { SidebarComponent } from '@/shared/components/sidebar/sidebar.component';
import { loadFlowbiteComponents } from '@/shared/utils/load-flowbite-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    loadFlowbiteComponents();
  }
}
