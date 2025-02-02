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
    return fetch(BaseUrl+'/userbook/v1/'+userId+'/'+bookId)
    .then(response => {
      if(response.status < 300){
        return response.json();
      }
      return null;
    })
    .then(books => books)
    .catch(error => {
      console.error(error);
    });
}

export const getBook = ( bookId: string) => {
  return fetch(BaseUrl+'/book/v1/'+ bookId )
  .then(response => response.json())
  .then(book => book)
  .catch(error => {
    console.error(error);
  });
}

export const getUser = (userId: string) => {
  return fetch(BaseUrl+'/getuser/v1/'+userId)
  .then(response => response.json())
  .then(user => {
    return user;
  })
  .catch(error => {
    console.error(error);
  });
}

export const getBooksList = (page: number) => {
  const url = BaseUrl+"/books/v1?page="+page;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' 
    }
  }) 
    .then(response => response.json())
    .then(books => {
      return books;
    })
    .catch(error => {
      console.error(error);
    });
}

export const assignBookToUser = (userId: string, bookId: string, rating: number, comments: string) => {
  const body = JSON.stringify({ "BookId": bookId, "UserId": userId, "Rating": rating, "Comments": comments });
  console.log(body);
  return fetch(BaseUrl+`/userbook/v1`, { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    
    body: body
});
}