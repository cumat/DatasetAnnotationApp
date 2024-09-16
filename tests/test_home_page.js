import { HomeButton } from '../frontend/components/homeButton/homeButton';
import { getDatasetName } from '../frontend/src/requests';

// Mock fetch globally
global.fetch = jest.fn((url) => {
  if (url.endsWith('/components/homeButton/homeButton.html')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(`
        <a class="home-button">
    <div class="home-button-container">
        <div class="home-button-title"></div>
        <div class="home-button-description"></div>
    </div>
    </a>
`),
    });
  } else if (url.endsWith('/page.html')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve('<div id="dataset-name">Sample Dataset</div>'),
    });
  }
  return Promise.reject(new Error('Not Found'));
});

// Mock the getDatasetName function
jest.mock('../frontend/src/requests', () => ({
  getDatasetName: jest.fn()
}));

describe('Home Page Integration Test', () => {
  beforeEach(() => {
    // Reset DOM and mocks before each test
    document.body.innerHTML = `
      <div id="root">
        <navbar-comp navtitle="Home"></navbar-comp>
        <flex-container direction="column" alignitems="center" justify="center" wrap="wrap">
            <h2 id="dataset-name"></h2>
        </flex-container>
        <flex-container direction="row" alignitems="center" justify="center" wrap="wrap">
            <home-button title="Annotate Dataset" description="This section allows you to annotate the dataset." href="annotate"></home-button>
            <home-button title="Compare Annotations" description="This section allows you to compare annotations." href="compare"></home-button>
        </flex-container>
      </div>
    `;
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  test('should fetch and display dataset name', async () => {
    // Mock implementation of getDatasetName
    getDatasetName.mockResolvedValue('Sample Dataset');

    // Import and run the main script
    await import('../frontend/src/home.js');

    // Verify the dataset name is displayed
    const nameElement = document.getElementById('dataset-name');
    expect(nameElement.textContent).toBe('Sample Dataset');
  });

  test('should render home buttons with correct attributes', () => {
    // Verify the HomeButton components render correctly
    const buttons = document.querySelectorAll('home-button');

    expect(buttons.length).toBe(2);

    const [button1, button2] = buttons;
    expect(button1.querySelector('.home-button-title').textContent).toBe('Annotate Dataset');
    expect(button1.querySelector('.home-button-description').textContent).toBe('This section allows you to annotate the dataset.');
    expect(button1.querySelector('a').getAttribute('href')).toBe('annotate');

    expect(button2.querySelector('.home-button-title').textContent).toBe('Compare Annotations');
    expect(button2.querySelector('.home-button-description').textContent).toBe('This section allows you to compare annotations.');
    expect(button2.querySelector('a').getAttribute('href')).toBe('compare');
  });
});