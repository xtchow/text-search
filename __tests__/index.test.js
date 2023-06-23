import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index';
import '@testing-library/jest-dom';

describe('Home Ex', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: 'Text Search' });
    expect(heading).toBeInTheDocument();
  })
});


import SearchBox from '../src/components/SearchBox';
describe('a search box', () => {
  render(<SearchBox />);

  it.todo('has an input bar.', () => {
    // it has a clear button within
  });
  it.todo('upon enter or button click, displays the results.', () => {});
});

// define a test suite
// describe('Text Search', () => {

//   // it('allows users to add in their own documents', () => {
//   // });


//   it.todo('has a default txt file to search');
//   it.todo('has a caching layer');
// });