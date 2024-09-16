// textLabels.test.js
import { TextLabels } from '../frontend/components/textLabels/textLabels';

describe('TextLabels Component', () => {
    let textLabels;

    beforeEach(() => {
        // Create an instance of the custom element
        textLabels = new TextLabels();
        document.body.appendChild(textLabels); // Append it to the DOM
    });

    afterEach(() => {
        // Clean up after each test
        document.body.innerHTML = '';
    });

    test('should initialize and attach to DOM', () => {
        expect(textLabels).toBeDefined();
        expect(textLabels instanceof HTMLElement).toBe(true);
        expect(document.body.contains(textLabels)).toBe(true);
    });

    test('should display correct number of labels', () => {
        const labels = ['Label 1', 'Label 2', 'Label 3'];
        textLabels.setLabels(labels, null, () => { });

        // Check that the container has children (label buttons)
        const buttons = textLabels.container.querySelectorAll('.text-label');
        expect(buttons.length).toBe(labels.length);

        // Verify that the labels are correct
        buttons.forEach((button, index) => {
            expect(button.textContent).toBe(labels[index]);
        });
    });

    test('should call onSelect when a label is clicked', () => {
        const labels = ['Label 1', 'Label 2'];
        const mockCallback = jest.fn(); // Mock the callback function
        textLabels.setLabels(labels, null, mockCallback);

        const firstLabelButton = textLabels.container.querySelector('.text-label');
        firstLabelButton.click();

        expect(mockCallback).toHaveBeenCalledWith('Label 1');
    });

    test('should update selected label when clicked', () => {
        const labels = ['Label 1', 'Label 2'];
        textLabels.setLabels(labels, 'Label 1', () => { });

        const buttons = textLabels.container.querySelectorAll('.text-label');

        // Check if the first button is selected initially
        expect(buttons[0].classList.contains('selected')).toBe(true);
        expect(buttons[1].classList.contains('selected')).toBe(false);

        // Simulate a click on the second button
        buttons[1].click();

        // Check if the second button is selected now
        expect(buttons[1].classList.contains('selected')).toBe(true);
        expect(buttons[0].classList.contains('selected')).toBe(false);
    });

    test('should adjust layout based on window resize', () => {
        const labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6'];
        textLabels.setLabels(labels, null, () => { });

        // Simulate large desktop size
        window.innerWidth = 1000;
        window.dispatchEvent(new Event('resize'));

        // Verify that buttons are distributed in rows of 4 (for large desktop)
        const rows = textLabels.container.querySelectorAll('.label-row');
        expect(rows[0].childNodes.length).toBe(4); // First row should have 4 buttons
        expect(rows[1].childNodes.length).toBe(2); // Second row should have 2 buttons
    });
});
