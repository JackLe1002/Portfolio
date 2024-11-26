import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class LoginTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_login(self):
        driver = self.driver
        driver.get("http://ht-website-ht-uat-coop.apps.prod.htuslab2.com/")

        login_button = driver.find_element(By.CSS_SELECTOR, "button.homepage-action-button:nth-of-type(1)")
        login_button.click()

        time.sleep(2)

        username_field = driver.find_element(By.ID, "formGroupEmailaddress")
        password_field = driver.find_element(By.ID, "formGroupPassword")
        username_field.send_keys("arshjots11@gmail.com")
        password_field.send_keys("HomeTrump2023!")

        login_button = driver.find_element(By.CLASS_NAME, "login-button")
        login_button.click()

        time.sleep(2)

        dashboard_element = driver.find_element(By.CLASS_NAME, "dashboard-title")
        self.assertTrue(dashboard_element.is_displayed())


    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
