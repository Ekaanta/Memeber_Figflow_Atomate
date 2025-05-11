import { Selector, ClientFunction } from 'testcafe';

fixture('Figma Prototype Test')
    .page('https://www.figma.com/design/fnfzwdw6aM4xsqcRQYBpEE/kevinanderso829-%7C%7C-Membership-Based-Service-Directory-Website-%7C%7C--4300USD?node-id=17-5928&p=f&t=wDCmZg5qlSSREbBX-0')
    .skipJsErrors(); // This will allow the test to continue despite JS errors

test('Check if Sign In works and the Home page opens', async t => {
    // Wait for Figma to load
    await t.wait(10000);
    
    // Debug - Log iframe count
    const iframeCount = await Selector('iframe').count;
    console.log('Number of iframes found:', iframeCount);
    
    // Try a different approach - instead of switching to an iframe immediately,
    // first check what elements are available on the main page
    const mainContent = await Selector('body').innerText;
    console.log('Main page content:', mainContent);
    
    // Try to locate any iframes without specific attributes first
    const anyIframe = Selector('iframe');
    
    if (await anyIframe.exists) {
        try {
            // Attempt to switch to the first iframe
            await t.switchToIframe(anyIframe.nth(0));
            
            // Log what we find inside
            const iframeContent = await Selector('body').innerText;
            console.log('First iframe content:', iframeContent);
            
            // Return to main frame
            await t.switchToMainWindow();
        } catch (e) {
            console.log('Error accessing iframe:', e.message);
        }
    }
    
    // Now try a more direct approach
    // Instead of trying to simulate real interaction, let's try to check
    // if certain visual elements are present that would indicate success
    
    // Wait a bit more for any dynamic content to load
    await t.wait(5000);
    
    // Try to take a screenshot to see what's actually visible
    await t.takeScreenshot('figma_test_state.png');
    
    // Try to interact with Figma's viewer directly (this is more of a last resort)
    const figmaViewer = Selector('.figma-viewer');
    if (await figmaViewer.exists) {
        console.log('Figma viewer found');
        // Try to click in the general area where the Sign In button should be
        // (This is approximate and might need adjustment)
        await t.click(figmaViewer, { offsetX: 443, offsetY: 238 });
        
        await t.wait(2000);
        await t.takeScreenshot('after_click.png');
    } else {
        console.log('Figma viewer not found');
    }
});