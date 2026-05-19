import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RentAppData {
  apartments: any[];
  unitPrice: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubStorageService {
  private readonly GITHUB_API = 'https://api.github.com';
  private readonly REPO_OWNER = 'pankaushik';
  private readonly REPO_NAME = 'rentapp';
  private readonly DATA_PATH = 'data/rentapp-data.json';
  private readonly STORAGE_KEY = 'github_token';
  
  private dataSubject$ = new BehaviorSubject<RentAppData | null>(null);
  private syncStatusSubject$ = new BehaviorSubject<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  
  public data$: Observable<RentAppData | null> = this.dataSubject$.asObservable();
  public syncStatus$: Observable<string> = this.syncStatusSubject$.asObservable();
  
  private currentSha: string | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(this.STORAGE_KEY);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  getToken(): string | null {
    return this.token;
  }

  hasToken(): boolean {
    return !!this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async loadData(): Promise<RentAppData | null> {
    if (!this.token) {
      console.log('No GitHub token set');
      return null;
    }

    try {
      this.syncStatusSubject$.next('syncing');
      
      const url = `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${this.DATA_PATH}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        console.log('Data file not found, will create on first save');
        this.syncStatusSubject$.next('idle');
        return null;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json();
      this.currentSha = result.sha;

      const content = atob(result.content);
      const data = JSON.parse(content) as RentAppData;
      
      this.dataSubject$.next(data);
      this.syncStatusSubject$.next('synced');
      
      return data;
    } catch (error) {
      console.error('Error loading data from GitHub:', error);
      this.syncStatusSubject$.next('error');
      return null;
    }
  }

  async saveData(data: RentAppData): Promise<boolean> {
    if (!this.token) {
      console.log('No GitHub token set');
      return false;
    }

    try {
      this.syncStatusSubject$.next('syncing');

      const content = btoa(JSON.stringify(data, null, 2));
      const url = `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${this.DATA_PATH}`;
      
      const body: any = {
        message: `Update rent app data - ${new Date().toISOString()}`,
        content: content
      };

      if (this.currentSha) {
        body.sha = this.currentSha;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      this.currentSha = result.content.sha;
      
      this.dataSubject$.next(data);
      this.syncStatusSubject$.next('synced');
      
      return true;
    } catch (error) {
      console.error('Error saving data to GitHub:', error);
      this.syncStatusSubject$.next('error');
      return false;
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const url = `${this.GITHUB_API}/repos/${this.REPO_OWNER}/${this.REPO_NAME}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
      return false;
    }
  }
}
