import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'schnittstellenpass';
  footballTrigger = false;

  // Fußball-Animation triggern
  triggerFootballAnimation() {
    this.footballTrigger = true;
    setTimeout(() => {
      this.footballTrigger = false;
    }, 2000);
  }

  // Optional: Maus-Position tracken für zusätzliche Effekte
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const container = document.querySelector('.container') as HTMLElement;
    if (container) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    }
  }
}
