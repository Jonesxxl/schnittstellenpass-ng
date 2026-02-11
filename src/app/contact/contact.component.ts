import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type RequestType = 'guest' | 'feedback';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  guestName: string;
  guestRole: string;
  guestReason: string;
  guestContact: string;
  episodeReference: string;
  feedbackType: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 overflow-x-hidden overflow-y-auto">
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <div class="absolute inset-0 grid grid-cols-6 grid-rows-6">
          @for (line of gridLines(); track line) {
            <div class="border border-white/30"></div>
          }
        </div>
      </div>

      <main class="relative z-10 container mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
        <section class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/40 border border-white/50 rounded-full shadow-md">
            <span class="icon-badge-3d icon-badge-xs icon-badge-green" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16v11H7l-3 3V5z"/>
              </svg>
            </span>
            <span class="text-sm font-bold text-gray-800">KONTAKT</span>
          </div>
          <h1 class="mt-5 text-4xl sm:text-5xl md:text-6xl font-black text-gray-900">Feature-Anfragen und Feedback</h1>
          <p class="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Schicke uns Vorschlaege fuer neue Gaeste oder Feedback zu einzelnen Folgen.
          </p>
        </section>

        <section class="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div class="lg:col-span-2 backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                (click)="setRequestType('guest')"
                class="w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 border"
                [class.bg-green-600]="requestType() === 'guest'"
                [class.text-white]="requestType() === 'guest'"
                [class.border-green-600]="requestType() === 'guest'"
                [class.bg-white/60]="requestType() !== 'guest'"
                [class.text-gray-800]="requestType() !== 'guest'"
                [class.border-white/50]="requestType() !== 'guest'">
                Neue Gäste anfragen
              </button>
              <button
                type="button"
                (click)="setRequestType('feedback')"
                class="w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 border"
                [class.bg-green-600]="requestType() === 'feedback'"
                [class.text-white]="requestType() === 'feedback'"
                [class.border-green-600]="requestType() === 'feedback'"
                [class.bg-white/60]="requestType() !== 'feedback'"
                [class.text-gray-800]="requestType() !== 'feedback'"
                [class.border-white/50]="requestType() !== 'feedback'">
                Feedback zu Folgen
              </button>
            </div>

            <form (ngSubmit)="submitForm()" class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-gray-700">Name</span>
                  <input
                    [(ngModel)]="formData.name"
                    name="name"
                    required
                    class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Dein Name">
                </label>
                <label class="block">
                  <span class="text-sm font-semibold text-gray-700">E-Mail</span>
                  <input
                    [(ngModel)]="formData.email"
                    name="email"
                    type="email"
                    required
                    class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="name@example.com">
                </label>
              </div>

              <label class="block">
                <span class="text-sm font-semibold text-gray-700">Betreff</span>
                <input
                  [(ngModel)]="formData.subject"
                  name="subject"
                  class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Kurzer Betreff">
              </label>

              @if (requestType() === 'guest') {
                <div class="grid sm:grid-cols-2 gap-4">
                  <label class="block">
                    <span class="text-sm font-semibold text-gray-700">Gastname</span>
                    <input
                      [(ngModel)]="formData.guestName"
                      name="guestName"
                      required
                      class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Name des Wunschgasts">
                  </label>
                  <label class="block">
                    <span class="text-sm font-semibold text-gray-700">Rolle/Funktion</span>
                    <input
                      [(ngModel)]="formData.guestRole"
                      name="guestRole"
                      class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="z. B. Trainer, Analyst, Ex-Profi">
                  </label>
                </div>
                <label class="block">
                  <span class="text-sm font-semibold text-gray-700">Warum passt die Person?</span>
                  <textarea
                    [(ngModel)]="formData.guestReason"
                    name="guestReason"
                    rows="3"
                    class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Kurz begruenden"></textarea>
                </label>
                <label class="block">
                  <span class="text-sm font-semibold text-gray-700">Kontakt/Profil (optional)</span>
                  <input
                    [(ngModel)]="formData.guestContact"
                    name="guestContact"
                    class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Instagram, Website oder E-Mail">
                </label>
              }

              @if (requestType() === 'feedback') {
                <div class="grid sm:grid-cols-2 gap-4">
                  <label class="block">
                    <span class="text-sm font-semibold text-gray-700">Folge/Referenz</span>
                    <input
                      [(ngModel)]="formData.episodeReference"
                      name="episodeReference"
                      required
                      class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="z. B. Titel oder Datum">
                  </label>
                  <label class="block">
                    <span class="text-sm font-semibold text-gray-700">Feedback-Typ</span>
                    <select
                      [(ngModel)]="formData.feedbackType"
                      name="feedbackType"
                      class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="inhalt">Inhalt</option>
                      <option value="gastwahl">Gastwahl</option>
                      <option value="audio">Audio/Qualitaet</option>
                      <option value="themenwunsch">Themenwunsch</option>
                    </select>
                  </label>
                </div>
              }

              <label class="block">
                <span class="text-sm font-semibold text-gray-700">Nachricht</span>
                <textarea
                  [(ngModel)]="formData.message"
                  name="message"
                  required
                  rows="5"
                  class="mt-1 w-full px-3 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deine Nachricht"></textarea>
              </label>

              @if (errorMessage()) {
                <p class="text-sm text-red-700 font-semibold">{{ errorMessage() }}</p>
              }
              @if (submitted()) {
                <p class="text-sm text-green-800 font-semibold">Mailprogramm wurde geoeffnet. Wenn nichts passiert, nutze die Direkt-E-Mail rechts.</p>
              }

              <button
                type="submit"
                class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 md:hover:scale-105">
                Anfrage absenden
              </button>
            </form>
          </div>

          <aside class="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <h2 class="text-2xl font-black text-gray-900 mb-4">Direktkontakt</h2>
            <p class="text-gray-700 mb-4">Du kannst uns auch direkt per Mail schreiben:</p>
            <a
              [href]="'mailto:' + contactEmail"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/70 border border-white/60 text-green-800 font-bold break-all">
              {{ contactEmail }}
            </a>

            <div class="mt-6 space-y-3 text-sm text-gray-700">
              <div class="p-3 rounded-xl bg-white/50 border border-white/50">
                <p class="font-bold text-gray-900">Neue Gäste</p>
                <p>Nenne Name, Kontext und warum die Person fuer die Community spannend ist.</p>
              </div>
              <div class="p-3 rounded-xl bg-white/50 border border-white/50">
                <p class="font-bold text-gray-900">Folgen-Feedback</p>
                <p>Nenne am besten den Folgentitel oder das Datum fuer eine schnelle Zuordnung.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  `
})
export class ContactComponent {
  protected readonly gridLines = signal(Array.from({ length: 36 }, (_, i) => i));
  protected readonly requestType = signal<RequestType>('guest');
  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly contactEmail = 'schnittstellenpassderpodcast@gmail.com';

  protected formData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    guestName: '',
    guestRole: '',
    guestReason: '',
    guestContact: '',
    episodeReference: '',
    feedbackType: 'inhalt'
  };

  protected setRequestType(type: RequestType): void {
    this.requestType.set(type);
    this.errorMessage.set(null);
    this.submitted.set(false);
  }

  protected submitForm(): void {
    if (!this.formData.name.trim() || !this.formData.email.trim() || !this.formData.message.trim()) {
      this.errorMessage.set('Bitte Name, E-Mail und Nachricht ausfuellen.');
      return;
    }

    if (this.requestType() === 'guest' && !this.formData.guestName.trim()) {
      this.errorMessage.set('Bitte den Namen des Wunschgasts eintragen.');
      return;
    }

    if (this.requestType() === 'feedback' && !this.formData.episodeReference.trim()) {
      this.errorMessage.set('Bitte eine Folge oder Referenz angeben.');
      return;
    }

    const lines = this.buildMailLines();
    const subject = encodeURIComponent(this.buildSubject());
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;

    this.errorMessage.set(null);
    this.submitted.set(true);
  }

  private buildSubject(): string {
    const prefix = this.requestType() === 'guest' ? 'Neue Gaesteanfrage' : 'Feedback zu Folge';
    const detail = this.formData.subject.trim();
    return detail ? `${prefix}: ${detail}` : prefix;
  }

  private buildMailLines(): string[] {
    const baseLines = [
      `Anfrage-Typ: ${this.requestType() === 'guest' ? 'Neue Gaeste' : 'Folgen-Feedback'}`,
      `Name: ${this.formData.name}`,
      `E-Mail: ${this.formData.email}`,
      ''
    ];

    if (this.requestType() === 'guest') {
      return [
        ...baseLines,
        `Gastname: ${this.formData.guestName}`,
        `Rolle/Funktion: ${this.formData.guestRole || '-'}`,
        `Kontakt/Profil: ${this.formData.guestContact || '-'}`,
        '',
        'Warum passt die Person?',
        this.formData.guestReason || '-',
        '',
        'Nachricht:',
        this.formData.message
      ];
    }

    return [
      ...baseLines,
      `Folge/Referenz: ${this.formData.episodeReference}`,
      `Feedback-Typ: ${this.formData.feedbackType}`,
      '',
      'Nachricht:',
      this.formData.message
    ];
  }
}
