package altcode;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

enum SelectorType { xpath, css }

public class HandyChromeDriver extends ChromeDriver {
  public int timeoutSeconds = 5;

  public HandyChromeDriver(ChromeOptions options) {
    super(options);
  }

  public static HandyChromeDriver initializeDriver() {
    ChromeOptions options = new ChromeOptions();

    //use the block image extension to prevent images from downloading.
    options.addExtensions(new File("Block-image_v1.1.crx"));

    String path = System.getProperty("os.name").startsWith("Mac") ?
        "bin/chromedriver" : "bin/chromedriver.exe";

    File file = new File(path);
    System.setProperty("webdriver.chrome.driver", file.getAbsolutePath());

    return new HandyChromeDriver(options);
  }

  public void getAndWait(String url) {
    super.get(url);
    this.waitForPageLoad();
  }

  public void waitForPageLoad() {
    try {
      Thread.sleep(500);
    } catch (Exception e) {}
    this.manage().timeouts().pageLoadTimeout(this.timeoutSeconds,
        TimeUnit.SECONDS);
  }

  public void waitFor(SelectorType type, String selector) {
    By path;
    if (type == SelectorType.css) {
      path = By.cssSelector(selector);
    } else {
      path = By.xpath(selector);
    }
    WebDriverWait wait = new WebDriverWait(this, this.timeoutSeconds);
    wait.until(ExpectedConditions.presenceOfElementLocated(path));
  }

  public void waitForAndType(SelectorType type, String selector,
      String text) {
    this.waitFor(type, selector);
    this.type(type, selector, text);
  }

  public void type(SelectorType type, String selector, String text) {
    this.find(type, selector).sendKeys(text);
  }

  public void waitForAndClick(SelectorType type, String selector) {
    this.waitFor(type, selector);
    this.click(type, selector);
  }

  public void click(SelectorType type, String selector) {
    this.find(type, selector).click();
  }

  public String waitForAndGetText(SelectorType type, String selector) {
    this.waitFor(type, selector);
    return this.getText(type, selector);
  }

  public String getText(SelectorType type, String selector) {
    return this.find(type, selector).getText();
  }

  public WebElement find(SelectorType type, String selector) {
    By path;
    if (type == SelectorType.css) {
      path = By.cssSelector(selector);
    } else {
      path = By.xpath(selector);
    }
		return this.findElement(path);
  }
}