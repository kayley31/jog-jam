import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Popup from '../Components/Popup';


test('Renders popup when show is true', () => {
    render(
        <Popup show={true} onClose={jest.fn()}>
            <div>Popup Content</div>
        </Popup>
    );

    // Check if the popup content is rendered
    expect(screen.getByText('Popup Content')).toBeInTheDocument();
});

test('Popup not rendered when show is false', () => {
    render(
        <Popup show={false} onClose={jest.fn()}>
            <div>Popup Content</div>
        </Popup>
    );

    // Check if popup content is not rendered
    expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();
});

test('onClose is called when button is clicked', () => {
    const onCloseMock = jest.fn();

    render(
        <Popup show={true} onClose={onCloseMock}>
            <div>Popup Content</div>
        </Popup>
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByText('×'));

    // Check if the onClose function is called
    expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('Renders child inside the popup', () => {
    render(
        <Popup show={true} onClose={jest.fn()}>
            <div>Child Content</div>
        </Popup>
    );

    // Check if the child content is rendered
    expect(screen.getByText('Child Content')).toBeInTheDocument();
});
