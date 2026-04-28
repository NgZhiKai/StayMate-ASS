import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 6000,          // virtual users
  duration: '600s',   // test duration
};

export default function () {
  http.get('https://www.staymate.org/');
  sleep(1);
}