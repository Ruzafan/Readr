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
  const url = BaseUrl+"/getbookslist/v1?page="+page;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' 
    }
  }) 
    .then(response => response.json())
    .then(books => {
      console.log(books);
      return books;
    })
    .catch(error => {
      console.error(error);
    });
}