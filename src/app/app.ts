import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/component/header/header';
import { ApiService } from './core/service/mocapi/api/api';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';



/* =========================================================
   🧩 ROOT COMPONENT
   Entry point of entire Angular application
   ========================================================= */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {



  /* =========================================================
     🧠 UI STATE
     ========================================================= */

  // Global overlay (modal background blur / lock screen)
  isOverlayOpen = false;

  // Prevent UI rendering before initial data load
  appReady = false;



  /* =========================================================
     🔄 SUBSCRIPTION CLEANUP
     Prevent memory leaks across entire app lifetime
     ========================================================= */
  private destroy$ = new Subject<void>();



  /* =========================================================
     🧱 CONSTRUCTOR
     Inject global state service
     ========================================================= */
  constructor(private api: ApiService) { }



  /* =========================================================
     🚀 APP BOOTSTRAP
     Runs once when application starts
     ========================================================= */
  ngOnInit() {

    /* -----------------------------------------
       Overlay Listener
       Any page can open global overlay (dialogs)
       ----------------------------------------- */
    this.api.overlayOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.isOverlayOpen = v);



    /* -----------------------------------------
       Initial App Load
       Loads:
       - Logged in session
       - Users store
       - Tasks store
       This runs ONLY once in whole app lifecycle
       ----------------------------------------- */
    this.api.initializeApp()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // App becomes visible only after data ready
        this.appReady = true;
      });
  }



  /* =========================================================
     🧹 CLEANUP
     Destroy all global subscriptions
     ========================================================= */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
