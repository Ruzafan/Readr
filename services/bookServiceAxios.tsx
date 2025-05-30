import Book from "@/models/book";
import api from "./axiosApi"; // Import the Axios instance

// Get user's book list
export const getUserBooksList = async (page: number, wishlist: boolean) => {
  try {
    const response = await api.get(`/userbook/v1/?page=${page}&wishlist=${wishlist}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFriendsWishlist = async (friendId:string) => {
  try {
    const response = await api.get(`/userbook/v1/?friendId=${friendId}&wishlist=true`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get a specific user book
export const getUserBook = async (bookId: string) => {
  try {
    const response = await api.get(`/userbook/v1/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get a specific book
export const getBook = async (bookId: string) => {
  try {
    const response = await api.get(`/book/v1/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get list of books with pagination
export const getBooksList = async (page: number, searchText: string) => {
  try {
    const url =`/books/v1?page=${page}&rows=20&filter=${searchText}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Assign a book to a user
export const assignBookToUser = async (bookId: string) => {
  try {
    const body = { BookId: bookId, Ownership: 1 };
    console.log(body);
    const response = await api.post(`/userbook/v1`, body);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateBook = async (book: object) => {
  try {
    console.log(book);
    const response = await api.patch(`/book/v1`, book);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateUserBook = async (book: object) => {
  try {
    console.log(book);
    const response = await api.post(`/userbook/v1`, book);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createBook = async (book: {
  title: string;
  author: string;
  genres: string;
  description: string;
  image: { uri: string; name: string; type: string };
}) => {
  const formData = new FormData();
  formData.append('title', book.title);
  formData.append('author', book.author);
  formData.append('genres', book.genres);
  formData.append('description', book.description);
  formData.append('image', {
    uri: book.image.uri,
    name: book.image.name,
    type: book.image.type,
  } as any);

  const response = await api.post('/book/create/v1', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const wishlist = async (bookId: string) => {
  try {
    const response = await api.post(`/wishlist/v1`, {"bookId": bookId});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const deleteUserBook = async (bookId: string) => {
  try {
    const response = await api.delete(`/userbook/v1?bookId=`+bookId);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const deleteBook = async (bookId: string) => {
  try {
    const response = await api.delete(`/book/v1?bookId=`+bookId);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}