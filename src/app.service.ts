import { Injectable, } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

function JSONParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return {}
  }
}


@Injectable()
export class AppService {
  private readonly baseUrl = 'http://localhost:11434/api/generate';

  constructor(private readonly httpService: HttpService) { }

  generateData(data: any): Observable<any> {
    return this.httpService.post(this.baseUrl, data).pipe(map(data => {
      const xData = data.data;

      const split = xData.split("\n");

      const arrOfObj = [];
      let messageResponse = '';
      let metaData = {

      };

      for (let i = 0; i < split.length; i++) {
        const objStr = split[i];
        const obj = JSONParse(objStr);
        const { done, response } = obj;

        if (!done) {
          arrOfObj.push(obj)
          if (response === '\n') {
            messageResponse += "[[linebreaks]]";
          }

          if (response !== '\n' && response !== undefined) {
            messageResponse += response;

          }
        }

        if (done) {
          const { model, created_at: createdAt, total_duration: totalDuration } = obj;
          metaData = {
            model,
            createdAt,
            totalDuration: totalDuration / (60 * 60 * 60 * 1000)
          }
        }
      }

      return {
        response: messageResponse,
        ...metaData
      };
    }));
  }
}
