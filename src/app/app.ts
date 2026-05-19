import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
export class App {
  title = 'Rent Calculation App';
  unitPrice = 8;

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

  calculateElectricityBill(apartment: Apartment): number {
    const consumption = apartment.currentReading - apartment.previousReading;
    return consumption > 0 ? consumption * this.unitPrice : 0;
  }

  calculateTotalRent(apartment: Apartment): number {
    return apartment.fixedRent + apartment.motorCharges + this.calculateElectricityBill(apartment);
  }
}
