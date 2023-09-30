import {URL, URLSearchParams} from 'url';

export class Utils {
  static getUrlBasePath(path: string | undefined): string {
    if (path) {
      const pathWithoutQuery = path.split('?')[0]; // Remove the query string
      return pathWithoutQuery.split('/')[1] || ''; // Extract the second part of the path
    } else {
      return '';
    }
  }

  public static getUrlParams(
    url: string | undefined
  ): URLSearchParams | undefined {
    if (!url) {
      return undefined;
    }

    console.log('URL Parameter:', url);

    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : 'http://' + url);
      const queryString = parsedUrl.search.slice(1); // Remove the leading '?'
      const searchParams = new URLSearchParams(queryString);
      return searchParams;
    } catch (error) {
      return undefined;
    }
  }
}
