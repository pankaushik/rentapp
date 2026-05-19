import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';

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

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadData();
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  private loadData(): void {
    const savedApartments = this.localStorageService.getItem<Apartment[]>(this.STORAGE_KEY);
    const savedUnitPrice = this.localStorageService.getItem<number>(this.UNIT_PRICE_KEY);

    if (savedApartments && savedApartments.length > 0) {
      this.apartments = savedApartments;
    }

    if (savedUnitPrice !== null) {
      this.unitPrice = savedUnitPrice;
    }
  }

  saveData(): void {
    this.localStorageService.setItem(this.STORAGE_KEY, this.apartments);
    this.localStorageService.setItem(this.UNIT_PRICE_KEY, this.unitPrice);
  }

  private setupAutoSave(): void {
    this.autoSaveInterval = window.setInterval(() => {
      this.saveData();
    }, 5000);
  }

  resetData(): void {
    if (confirm('Are you sure you want to reset all data? This will clear all saved readings.')) {
      this.localStorageService.removeItem(this.STORAGE_KEY);
      this.localStorageService.removeItem(this.UNIT_PRICE_KEY);
      this.apartments = this.apartments.map(apt => ({
        ...apt,
        previousReading: 0,
        currentReading: 0
      }));
      this.unitPrice = 8;
    }
  }

  moveCurrentToPrevious(): void {
    this.apartments = this.apartments.map(apt => ({
      ...apt,
      previousReading: apt.currentReading
    }));
    this.saveData();
  }

  calculateElectricityBill(apartment: Apartment): number {
    const consumption = apartment.currentReading - apartment.previousReading;
    return consumption > 0 ? consumption * this.unitPrice : 0;
  }

  calculateTotalRent(apartment: Apartment): number {
    return apartment.fixedRent + apartment.motorCharges + this.calculateElectricityBill(apartment);
  }
}
