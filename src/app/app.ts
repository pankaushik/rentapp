import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';
import { GithubStorageService, RentAppData } from './services/github-storage.service';

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
  private dataHash = '';

  isGithubConfigured = false;
  isSyncing = false;
  lastSyncTime?: Date;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' = 'idle';
  showTokenSetup = false;
  githubToken = '';

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
    private githubStorage: GithubStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isGithubConfigured = this.githubStorage.hasToken();

    if (this.isGithubConfigured) {
      await this.initializeGithubStorage();
    } else {
      this.loadDataFromLocalStorage();
    }

    this.setupAutoSave();

    this.githubStorage.syncStatus$.subscribe(status => {
      this.syncStatus = status as 'idle' | 'syncing' | 'synced' | 'error';
      this.isSyncing = status === 'syncing';
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  async initializeGithubStorage(): Promise<void> {
    const cloudData = await this.githubStorage.loadData();
    if (cloudData) {
      this.apartments = cloudData.apartments;
      this.unitPrice = cloudData.unitPrice;
      this.lastSyncTime = new Date(cloudData.lastUpdated);
      this.updateDataHash();
    } else {
      this.loadDataFromLocalStorage();
      this.updateDataHash();
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

  private updateDataHash(): void {
    const data = {
      apartments: this.apartments,
      unitPrice: this.unitPrice
    };
    this.dataHash = JSON.stringify(data);
  }

  private hasDataChanged(): boolean {
    const currentData = {
      apartments: this.apartments,
      unitPrice: this.unitPrice
    };
    const currentHash = JSON.stringify(currentData);
    return this.dataHash !== currentHash;
  }

  async saveData(): Promise<void> {
    this.localStorageService.setItem(this.STORAGE_KEY, this.apartments);
    this.localStorageService.setItem(this.UNIT_PRICE_KEY, this.unitPrice);

    if (this.isGithubConfigured) {
      const data: RentAppData = {
        apartments: this.apartments,
        unitPrice: this.unitPrice,
        lastUpdated: new Date().toISOString()
      };

      const success = await this.githubStorage.saveData(data);
      if (success) {
        this.lastSyncTime = new Date();
        this.updateDataHash();
      }
    } else {
      this.updateDataHash();
    }
  }

  private setupAutoSave(): void {
    this.autoSaveInterval = window.setInterval(async () => {
      if (this.hasDataChanged()) {
        await this.saveData();
      }
    }, 30000); // Save every 30 seconds if data changed
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

  async setupGithubToken(): Promise<void> {
    if (!this.githubToken.trim()) {
      alert('Please enter a GitHub token');
      return;
    }

    this.githubStorage.setToken(this.githubToken.trim());

    const isValid = await this.githubStorage.checkConnection();
    if (isValid) {
      this.isGithubConfigured = true;
      this.showTokenSetup = false;
      await this.initializeGithubStorage();

      // Upload local data to GitHub if cloud is empty
      const cloudData = await this.githubStorage.loadData();
      if (!cloudData) {
        await this.saveData();
      }

      alert('GitHub storage connected successfully!');
    } else {
      this.githubStorage.clearToken();
      alert('Invalid GitHub token or repository access denied. Please check your token.');
    }

    this.githubToken = '';
  }

  toggleTokenSetup(): void {
    this.showTokenSetup = !this.showTokenSetup;
  }

  disconnectGithub(): void {
    if (confirm('Disconnect from GitHub? Data will only be saved locally.')) {
      this.githubStorage.clearToken();
      this.isGithubConfigured = false;
      this.showTokenSetup = false;
    }
  }

  calculateElectricityBill(apartment: Apartment): number {
    const consumption = apartment.currentReading - apartment.previousReading;
    return consumption > 0 ? consumption * this.unitPrice : 0;
  }

  calculateTotalRent(apartment: Apartment): number {
    return apartment.fixedRent + apartment.motorCharges + this.calculateElectricityBill(apartment);
  }
}
