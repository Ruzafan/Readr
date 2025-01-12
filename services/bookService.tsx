import { BaseUrl } from "@/constants/Url";

export const getUserBooksList = (userId: string) => {
    return fetch(BaseUrl+'/getuserbooklist/v1/'+userId)
    .then(response => response.json())
    .then(books => {
      return books;
    })
    .catch(error => {
      console.error(error);
    });
}

export const getUserBook = (userId: string, bookId: string) => {
    return fetch(BaseUrl+'/getuserbook/v1/'+ bookId +'/'+userId)
    .then(response => response.json())
    .then(books => {
      return books;
    })
    .catch(error => {
      console.error(error);
    });
}

export const getBooksList = (page: number) => {
  return fetch(BaseUrl+"/v1/getbooklist?page="+page)
    .then(response => response.json())
    .then(books => {
      return books;
    })
    .catch(error => {
      console.error(error);
    });
}