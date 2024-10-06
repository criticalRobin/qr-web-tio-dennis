import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IChannel } from '../interfaces/channel.interface';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private baseUrl: string = `${environment.BASE_URL}channels`;
  private readonly httpClient: HttpClient = inject(HttpClient);

  getChannels(): Observable<IChannel[]> {
    return this.httpClient.get<IChannel[]>(this.baseUrl);
  }

  getChannelById(id: number): Observable<IChannel> {
    return this.httpClient.get<IChannel>(`${this.baseUrl}/${id}`);
  }

  createChannel(channel: IChannel): Observable<IChannel> {
    return this.httpClient.post<IChannel>(this.baseUrl, channel);
  }

  updateChannel(id: number, channel: IChannel): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, channel);
  }

  deleteChannel(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
