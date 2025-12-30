/**
 * MY PRETTY FAMILY - Video Player Controller
 * Gère les vidéos avec overlay play/pause personnalisé
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(function(card) {
      const video = card.querySelector('.video-player');
      const overlay = card.querySelector('.video-overlay');
      const playBtn = card.querySelector('.video-play-btn');
      
      if (!video || !overlay || !playBtn) return;
      
      // Clic sur le bouton play
      playBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        playVideo(video, overlay);
      });
      
      // Clic sur l'overlay
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        playVideo(video, overlay);
      });
      
      // Quand la vidéo se met en pause
      video.addEventListener('pause', function() {
        showOverlay(overlay);
      });
      
      // Quand la vidéo se termine
      video.addEventListener('ended', function() {
        showOverlay(overlay);
        video.currentTime = 0;
      });
      
      // Quand la vidéo joue
      video.addEventListener('play', function() {
        hideOverlay(overlay);
        // Pause les autres vidéos
        pauseOtherVideos(video);
      });
    });
    
    /**
     * Lance la lecture de la vidéo
     */
    function playVideo(video, overlay) {
      hideOverlay(overlay);
      video.play().catch(function(error) {
        console.warn('Erreur de lecture vidéo:', error);
        showOverlay(overlay);
      });
    }
    
    /**
     * Cache l'overlay
     */
    function hideOverlay(overlay) {
      overlay.classList.add('hidden');
    }
    
    /**
     * Affiche l'overlay
     */
    function showOverlay(overlay) {
      overlay.classList.remove('hidden');
    }
    
    /**
     * Met en pause toutes les autres vidéos
     */
    function pauseOtherVideos(currentVideo) {
      const allVideos = document.querySelectorAll('.video-player');
      allVideos.forEach(function(video) {
        if (video !== currentVideo && !video.paused) {
          video.pause();
        }
      });
    }
  });
  
})();
