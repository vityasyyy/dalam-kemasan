package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	// hashes the password using bcrypt
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	// compares the hashed password in the database with the password that the user entered
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
