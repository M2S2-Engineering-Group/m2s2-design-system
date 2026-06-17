import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

const anchorItem = { id: 'item-1', text: 'Profile', href: '/profile' };
const clickableItem = { id: 'item-2', text: 'Logout', onClick: () => {} };

describe('Dropdown', () => {
  it('is closed by default', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens when the trigger is clicked', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders anchor items in the menu', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
  });

  it('renders button items in the menu', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[clickableItem]} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument();
  });

  it('closes when Escape is pressed', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles closed when trigger is clicked again', () => {
    render(<Dropdown trigger={<button>Menu</button>} items={[anchorItem]} />);
    fireEvent.click(screen.getByText('Menu'));
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
