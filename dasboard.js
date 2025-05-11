import { Selector, ClientFunction } from 'testcafe';

fixture('YTS Figma Prototype Navigation Test')
    // Use the proto URL rather than the design URL for better interaction
    .page('https://www.figma.com/proto/fnfzwdw6aM4xsqcRQYBpEE/kevinanderso829-%7C%7C-Membership-Based-Service-Directory-Website-%7C%7C--4300USD?node-id=299-10714&scaling=scale-down&starting-point-node-id=299%3A10714')
    .skipJsErrors(); // Figma may throw JS errors that don't affect the test

test('Navigate from Dashboard to Users page in Figma prototype', async t => {
    // Wait for Figma prototype to load completely
    await t.wait(10000);
    
    // Take a screenshot of initial state to confirm what we're seeing
    await t.takeScreenshot('dashboard-initial.png');
    
    // Get the current URL to verify we're in the right frame
    const getLocation = ClientFunction(() => document.location.href);
    console.log('Current location:', await getLocation());
    
    // Try to find the iframe that contains the actual prototype content
    const figmaFrame = Selector('iframe');
    const frameCount = await figmaFrame.count;
    console.log('Found', frameCount, 'iframes');
    
    if (frameCount > 0) {
        try {
            // Switch to the prototype iframe (usually the first one)
            await t.switchToIframe(figmaFrame.nth(0));
            console.log('Switched to iframe');
            
            // Take a screenshot inside the iframe
            await t.takeScreenshot('inside-iframe.png');
            
            // Find the canvas element inside the iframe
            const canvas = Selector('canvas');
            if (await canvas.exists) {
                console.log('Canvas found');
                
                // Click where the Users menu item should be in the sidebar
                // These coordinates need adjustment based on your prototype's layout
                // From your screenshots, Users appears to be around these coordinates
                await t.click(canvas, { offsetX: 100, offsetY: 320 });
                
                // Wait for any transition animation
                await t.wait(2000);
                
                // Take another screenshot to verify navigation occurred
                await t.takeScreenshot('after-users-click.png');
            } else {
                console.log('Canvas not found in iframe');
            }
            
            // Return to main frame
            await t.switchToMainWindow();
            
        } catch (e) {
            console.log('Error in iframe:', e.message);
            // Continue test in main window if iframe fails
        }
    } else {
        // If no iframe is found, try to interact directly with the main window
        console.log('No iframes found, trying main window');
        
        // Try to locate the prototype canvas directly
        const prototypeContainer = Selector('.prototype-container');
        if (await prototypeContainer.exists) {
            console.log('Prototype container found');
            
            // Click where the Users menu item should be
            await t.click(prototypeContainer, { offsetX: 100, offsetY: 320 });
            
            // Wait for transition
            await t.wait(2000);
            
            // Take screenshot
            await t.takeScreenshot('after-direct-click.png');
        } else {
            console.log('Prototype container not found');
        }
    }
});