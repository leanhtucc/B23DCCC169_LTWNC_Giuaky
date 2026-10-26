import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from '../components/BookCard/BookCard';
import type { Book } from '../types';

const mockBook: Book = {
  id: 'book-1',
  title: 'Lập trình TypeScript',
  author: 'Nguyễn Văn An',
  category: 'CNTT',
  year: 2023,
  available: 2,
  total: 3,
};

const mockBookOutOfStock: Book = {
  ...mockBook,
  id: 'book-2',
  available: 0,
};

describe('BookCard component', () => {
  // Test 1: Hiển thị đúng thông tin sách
  it('should display book information correctly', () => {
    const onBorrow = jest.fn();
    const onReturn = jest.fn();

    render(
      <BookCard
        book={mockBook}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={onReturn}
      />
    );

    expect(screen.getByText('Lập trình TypeScript')).toBeInTheDocument();
    expect(screen.getByText(/Nguyễn Văn An/)).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText(/Còn 2\/3 bản/)).toBeInTheDocument();
  });

  // Test 2: Click "Mượn" gọi đúng hàm với đúng id
  it('should call onBorrow with correct book id when borrow button is clicked', async () => {
    const onBorrow = jest.fn();
    const onReturn = jest.fn();
    const user = userEvent.setup();

    render(
      <BookCard
        book={mockBook}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={onReturn}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /mượn sách/i });
    await user.click(borrowBtn);

    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('book-1');
  });

  // Test 3: Nút "Mượn" bị disabled khi available === 0
  it('should disable borrow button when available is 0', () => {
    const onBorrow = jest.fn();
    const onReturn = jest.fn();

    render(
      <BookCard
        book={mockBookOutOfStock}
        isBorrowed={false}
        onBorrow={onBorrow}
        onReturn={onReturn}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /hết bản/i });
    expect(borrowBtn).toBeDisabled();
  });

  // Test 4: Hiển thị nút "Trả" khi isBorrowed = true
  it('should show return button when book is borrowed', () => {
    const onBorrow = jest.fn();
    const onReturn = jest.fn();

    render(
      <BookCard
        book={mockBook}
        isBorrowed={true}
        onBorrow={onBorrow}
        onReturn={onReturn}
      />
    );

    expect(screen.getByRole('button', { name: /trả sách/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mượn sách/i })).not.toBeInTheDocument();
  });
});
