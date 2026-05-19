import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInAnonymously, 
  User,
  onAuthStateChanged 
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RentAppData {
  apartments: any[];
  unitPrice: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private dataSubject$ = new BehaviorSubject<RentAppData | null>(null);
  
  public user$: Observable<User | null> = this.currentUser$.asObservable();
  public data$: Observable<RentAppData | null> = this.dataSubject$.asObservable();

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
      if (user) {
        this.listenToData(user.uid);
      }
    });
  }

  async signInAnonymously(): Promise<User | null> {
    try {
      const result = await signInAnonymously(this.auth);
      return result.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      return null;
    }
  }

  async saveData(userId: string, data: RentAppData): Promise<void> {
    try {
      const docRef = doc(this.db, 'rentAppData', userId);
      await setDoc(docRef, {
        ...data,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error saving data to Firebase:', error);
      throw error;
    }
  }

  async loadData(userId: string): Promise<RentAppData | null> {
    try {
      const docRef = doc(this.db, 'rentAppData', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;
        return {
          apartments: data['apartments'],
          unitPrice: data['unitPrice'],
          lastUpdated: data['lastUpdated']?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
      return null;
    }
  }

  private listenToData(userId: string): void {
    const docRef = doc(this.db, 'rentAppData', userId);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as DocumentData;
        this.dataSubject$.next({
          apartments: data['apartments'],
          unitPrice: data['unitPrice'],
          lastUpdated: data['lastUpdated']?.toDate() || new Date()
        });
      }
    });
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isConfigured(): boolean {
    return environment.firebase.apiKey !== 'YOUR_API_KEY';
  }
}
