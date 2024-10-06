import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAgency } from '../interfaces/agency.interface';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private baseUrl: string = `${environment.BASE_URL}agencies`;
  private readonly httpClient: HttpClient = inject(HttpClient);

  getAgencies(): Observable<IAgency[]> {
    return this.httpClient.get<IAgency[]>(this.baseUrl);
  }

  getAgencyById(id: number): Observable<IAgency> {
    return this.httpClient.get<IAgency>(`${this.baseUrl}/${id}`);
  }

  createAgency(agency: IAgency): Observable<IAgency> {
    return this.httpClient.post<IAgency>(this.baseUrl, agency);
  }

  updateAgency(id: number, agency: IAgency): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, agency);
  }

  deleteAgency(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
