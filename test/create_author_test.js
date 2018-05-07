import assert from 'assert';
import { Author } from '../data/models/author.model';

describe('Creating author', () => {
    it('saves an author', (done) => {

        const author = new Author({
            firstName: "Jackie",
            lastName: "Chen"
        });

        author.save()
            .then(() => {
                assert(!author.isNew)
                done();
            });
    });
});