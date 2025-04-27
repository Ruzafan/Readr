export default class Book {
    id: string | undefined;
    image: string | undefined;
    title: string | undefined;
    authors: string[] | undefined;
    genres: Array<string> | undefined;
    description: string | undefined;
    wished: boolean | undefined;
    pages: number | undefined;
}