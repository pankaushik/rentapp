import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';
import { FirebaseService } from './services/firebase.service';

interface Apartment {
  name: string;
  fixedRent: number;
  motorCharges: number;
  previousReading: number;
  currentReading: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'Rent Calculation App';
  unitPrice = 8;

  private readonly STORAGE_KEY = 'rentapp_apartments';
  private readonly UNIT_PRICE_KEY = 'rentapp_unit_price';
  private autoSaveInterval?: number;

  isFirebaseConfigured = false;
  isSignedIn = false;
  isSyncing = false;
  lastSyncTime?: Date;

  apartments: Apartment[] = [
    {
      name: 'Top Floor',
      fixedRent: 15000,
      motorCharges: 0,
      previousReading: 0,
      currentReading: 0
    },
    {
      name: 'Second Floor Front',
      fixedRent: 23000,
      motorCharges: 500,
      previousReading: 0,
      currentReading: 0
    },
    {
      name: 'Second Floor Back',
      fixedRent: 24000,
      motorCharges: 500,
      previousReading: 0,
      currentReading: 0
    },
    {
      name: 'Parking Floor',
      fixedRent: 23000,
      motorCharges: 500,
      previousReading: 0,
      currentReading: 0
    }
  ];

  constructor(
    private localStorageService: LocalStorageService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.isFirebaseConfigured = this.firebaseService.isConfigured();

    if (this.isFirebaseConfigured) {
      this.initializeFirebase();
    } else {
      this.loadDataFromLocalStorage();
    }

    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  private async initializeFirebase(): Promise<void> {
    this.firebaseService.user$.subscribe(user => {
      this.isSignedIn = !!user;
    });

    this.firebaseService.data$.subscribe(data => {
      if (data) {
        this.apartments = data.apartments;
        this.unitPrice = data.unitPrice;
        this.lastSyncTime = data.lastUpdated;
        this.isSyncing = false;
      }
    });

    const user = this.firebaseService.getCurrentUser();
    if (!user) {
      await this.firebaseService.signInAnonymously();
    }

    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser) {
      const cloudData = await this.firebaseService.loadData(currentUser.uid);
      if (cloudData) {
        this.apartments = cloudData.apartments;
        this.unitPrice = cloudData.unitPrice;
        this.lastSyncTime = cloudData.lastUpdated;
      } else {
        const localData = this.loadDataFromLocalStorage();
        if (localData) {
          await this.saveData();
        }
      }
    }
  }

  private loadDataFromLocalStorage(): boolean {
    const savedApartments = this.localStorageService.getItem<Apartment[]>(this.STORAGE_KEY);
    const savedUnitPrice = this.localStorageService.getItem<number>(this.UNIT_PRICE_KEY);

    let hasData = false;
    if (savedApartments && savedApartments.length > 0) {
      this.apartments = savedApartments;
      hasData = true;
    }

    if (savedUnitPrice !== null) {
      this.unitPrice = savedUnitPrice;
      hasData = true;
    }

    return hasData;
  }

  async saveData(): Promise<void> {
    this.localStorageService.setItem(this.STORAGE_KEY, this.apartments);
    this.localStorageService.setItem(this.UNIT_PRICE_KEY, this.unitPrice);

    if (this.isFirebaseConfigured && this.isSignedIn) {
      const user = this.firebaseService.getCurrentUser();
      if (user) {
        try {
          this.isSyncing = true;
          await this.firebaseService.saveData(user.uid, {
            apartments: this.apartments,
            unitPrice: this.unitPrice,
            lastUpdated: new Date()
          });
          this.lastSyncTime = new Date();
          this.isSyncing = false;
        } catch (error) {
          console.error('Failed to sync to cloud:', error);
          this.isSyncing = false;
        }
      }
    }
  }

  private setupAutoSave(): void {
    this.autoSaveInterval = window.setInterval(() => {
      this.saveData();
    }, 5000);
  }

  async resetData(): Promise<void> {
    if (confirm('Are you sure you want to reset all data? This will clear all saved readings.')) {
      this.localStorageService.removeItem(this.STORAGE_KEY);
      this.localStorageService.removeItem(this.UNIT_PRICE_KEY);
      this.apartments = this.apartments.map(apt => ({
        ...apt,
        previousReading: 0,
        currentReading: 0
      }));
      this.unitPrice = 8;
      await this.saveData();
    }
  }

  async moveCurrentToPrevious(): Promise<void> {
    this.apartments = this.apartments.map(apt => ({
      ...apt,
      previousReading: apt.currentReading
    }));
    await this.saveData();
  }

  calculateElectricityBill(apartment: Apartment): number {
    const consumption = apartment.currentReading - apartment.previousReading;
    return consumption > 0 ? consumption * this.unitPrice : 0;
  }

  calculateTotalRent(apartment: Apartment): number {
    return apartment.fixedRent + apartment.motorCharges + this.calculateElectricityBill(apartment);
  }
}
