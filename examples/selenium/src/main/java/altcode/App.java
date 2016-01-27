package altcode;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        WebDriver driver = HandyChromeDriver.initializeDriver();
        
        //driver.get("http://topsy.com/s?q=%23ILookLikeAnEngineer&sort=-date&mintime=1438630000&maxtime=1438635000");
        driver.get("http://topsy.com/s?q=%23ILookLikeAnEngineer&sort=-date&mintime=1438635000&maxtime=1438640000");

		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"results\"]")));
		for(int x = 1; x <=10; x++)
		{
			for( int i = 1; i <= 11; i++ )
			{
				By datePath = By.xpath("//*[@id=\"results\"]/div["+i+"]/div/div/ul/li[1]/small/a/span[2]");
				By twitterPath = By.xpath("//*[@id=\"results\"]/div["+i+"]/div/div/ul/li[1]/small/a");
			
				By datePathWithImg = By.xpath("//*[@id=\"results\"]/div["+i+"]/div/div/div/div/ul/li[1]/small/a/span[2]");
				By twitterPathWithImg = By.xpath("//*[@id=\"results\"]/div["+i+"]/div/div/div/div/ul/li[1]/small/a");
			
				WebElement dateElement = TryGetElementByPaths(driver, datePath, datePathWithImg);
				WebElement twitterElement = TryGetElementByPaths(driver, twitterPath, twitterPathWithImg);

				if( dateElement != null )
				{
					System.out.println(dateElement.getAttribute("data-timestamp"));
				}
				if( twitterElement != null )
				{
					System.out.println(twitterElement.getAttribute("href"));
				}
			}
			//click on the 'next' button 
			driver.findElement(By.xpath("//*[@id=\"module-pager\"]/div/ul/li[12]/a")).click();
	}
		
    }

	private static WebElement TryGetElementByPaths(WebDriver driver, By path, By pathWithImg) {
		WebElement dateElement = null;
		try
		{
			dateElement = driver.findElement(path);
		}
		catch( NoSuchElementException e )
		{
			try
			{
				dateElement = driver.findElement(pathWithImg);
			}
			catch( NoSuchElementException e2 )
			{
				// Usually image banners.
			}
		}
		return dateElement;
	}
}
