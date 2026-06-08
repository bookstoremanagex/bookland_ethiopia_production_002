-- Run this once to add FULLTEXT indexes for fast book search.
-- FULLTEXT indexes enable MATCH...AGAINST queries which are
-- significantly faster than LIKE '%query%' on large datasets.

CREATE FULLTEXT INDEX books_fulltext_title_author_isbn_idx
    ON Books(title, author, isbn);
