import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  activeSection: string = "home";


  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        if (url === '/' || url.startsWith('/#')) {
          this.activeSection = 'home';
        } else if (url.startsWith('/sobre')) {
          this.activeSection = 'sobre';
        } else if (url.includes('servico')) {
        } else {
          this.activeSection = '';
        }
      }
    });
  }

  setActive(active: string) {
    this.activeSection = active;
  }
}