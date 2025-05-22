package utils

import (
	"os"

	"github.com/gin-gonic/gin"
)

// later we have to have a way to set the tryout cookie so that when user is accessing the try out, the cookie doesnt expire that fast
var cookieDomain = os.Getenv("COOKIE_DOMAIN")

func SetCookie(c *gin.Context, name, value string, maxAge int, path, domain string, secure, httpOnly bool) {
	c.SetCookie(
		name,
		value,
		maxAge,
		path,
		domain,
		secure,
		httpOnly)
}

func SetAccessAndRefresh(c *gin.Context, accessToken, refreshToken string) error {
	SetCookie(c, "access_token", accessToken, 15*60, "/", cookieDomain, true, true)        // access token, 15 mins
	SetCookie(c, "refresh_token", refreshToken, 7*24*60*60, "/", cookieDomain, true, true) // refresh token, 7 days
	return nil
}

func GetCookie(c *gin.Context, name string) (string, error) {
	cookie, err := c.Cookie(name)
	if err != nil {
		return "", err
	}
	return cookie, nil
}

func ClearCookie(c *gin.Context, name string) {
	SetCookie(c, name, "", -1, "/", cookieDomain, true, true)
}
