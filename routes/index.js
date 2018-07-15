const express = require('express');
const userJoin = require('../controllers/userJoin');
const userUpdate = require('../controllers/userUpdate');
const userSearch = require('../controllers/userSearch');
const messageChat = require('../controllers/messageChat');
const messageSearch = require('../controllers/messageSearch');
const administer = require('../controllers/administer');
const activityHelp = require('../controllers/activity');

const router = express.Router();
const authToken = require('../auth/authToken');
const voice = require('../controllers/voiceMessg');

router.post('/users', userJoin.register);
router.post('/users/login', userJoin.login);
router.post('/users/status', authToken, userUpdate.updateStatus);
router.get('/users', authToken, userUpdate.getUsers);
router.get('/users/username/:username', authToken, userSearch.searchUsername);
router.get('/users/status/:statusCode', authToken, userSearch.searchStatus);

router.post('/voice/recall', authToken, voice.recall);

router.post('/users/position', authToken, userUpdate.updatePosition);

router.post('/messages/announcements', authToken, messageChat.postAnnoun);
router.get('/messages/announcements', authToken, messageChat.getAnnoun);
router.get('/messages/announcements/:text', authToken, messageSearch.searchAnnoun);
router.post('/messages/publicMessages', authToken, messageChat.postPublic);
router.post('/messages/privateMessages', authToken, messageChat.postPrivate);
router.get('/messages/publicHistory', authToken, messageChat.getPublicHistory);
router.get('/messages/privateHistory/:username', authToken, messageChat.getPrivateHistory);
router.get('/messages/privateMessages/:text', authToken, messageSearch.searchPrivate);
router.get('/messages/publicMessages/:text', authToken, messageSearch.searchPublic);
router.put('/users/profiles', authToken, administer.updateProfile);

router.get('/activities', authToken, activityHelp.getActivity);
router.post('/activities', authToken, activityHelp.postActivity);
router.post('/activities/register', authToken, activityHelp.register);
router.post('/activities/unregister', authToken, activityHelp.unregister);

module.exports = router;
