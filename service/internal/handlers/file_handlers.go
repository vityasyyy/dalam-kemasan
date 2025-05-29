package handlers

import (
	"fmt"
	"io"
	"net/http"
	"service/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

const maxFileSize = 5 * 1024 * 1024 // 5MB

type FileHandler struct {
	fileService services.FileService
}

func NewFileHandler(fileService services.FileService) *FileHandler {
	return &FileHandler{fileService: fileService}
}

func (h *FileHandler) UploadFileHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get current user's package from context
	currentUserPackage, ok := c.Get("package")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user package from context"})
		return
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not provided or invalid"})
		return
	}

	if fileHeader.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds the limit of %d bytes", maxFileSize)})
		return
	}

	fileMetadata, err := h.fileService.UploadFile(c.Request.Context(), userID, fileHeader, currentUserPackage.(string)) // Pass package to service
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload file: %s", err.Error())})
		return
	}

	c.JSON(http.StatusCreated, fileMetadata)
}

func (h *FileHandler) DownloadFileHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	fileIDStr := c.Param("fileID")
	fileID, err := strconv.Atoi(fileIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	// Get current user's package from context
	currentUserPackage, ok := c.Get("package")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user package from context"})
		return
	}

	object, fileMetadata, err := h.fileService.DownloadFile(c.Request.Context(), userID, fileID, currentUserPackage.(string)) // Pass package to service
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to download file: %s", err.Error())})
		return
	}
	defer object.Close()

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileMetadata.FileName))
	c.Header("Content-Type", fileMetadata.ContentType)
	c.Header("Content-Length", strconv.FormatInt(fileMetadata.FileSize, 10))

	_, err = io.Copy(c.Writer, object)
	if err != nil {
		// Log error, but headers might have already been sent
		fmt.Println("Error copying file to response:", err) // Or use your logger
		return
	}
}

func (h *FileHandler) DeleteFileHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	fileIDStr := c.Param("fileID")
	fileID, err := strconv.Atoi(fileIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	err = h.fileService.DeleteFile(c.Request.Context(), userID, fileID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to delete file: %s", err.Error())})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}

func (h *FileHandler) GetBillingInfoHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	storageInfo, err := h.fileService.GetUserStorageInfo(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get storage info"})
		return
	}

	c.JSON(http.StatusOK, storageInfo)
}

func (h *FileHandler) ListFilesHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	files, err := h.fileService.ListUserFiles(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list files"})
		return
	}

	c.JSON(http.StatusOK, files)
}

// Helper function to get user ID from context
func getUserIDFromContext(c *gin.Context) (int, error) {
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		return 0, fmt.Errorf("user_id not found in context")
	}
	userID, ok := userIDInterface.(int)
	if !ok {
		return 0, fmt.Errorf("user_id is not of type int")
	}
	return userID, nil
}
