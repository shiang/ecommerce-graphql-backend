import assert from 'assert';
import { Author } from '../data/models/author.model';

describe('Reading author from the database', () => {

    let author;

    beforeEach((done) => {
        author = new Author({
            firstName: "Jackie",
            lastName: "Chen"
        });
        author.save()
            .then(() => done());
    })

    it('finds an existing author with its id', (done) => {


        Author.find({ lastName: "Jackie" })
            .then((authors) => {
                console.log(authors);
                done();
            })
    });
});