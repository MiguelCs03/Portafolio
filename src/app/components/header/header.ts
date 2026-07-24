import { Component, HostListener, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isScrolled = false;
  isDark = true;

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      this.isDark = false;
      document.documentElement.classList.remove('dark');
    } else {
      this.isDark = true;
      document.documentElement.classList.add('dark');
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
