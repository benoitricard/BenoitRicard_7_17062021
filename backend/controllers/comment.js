// Dépendances
const models = require('../models');
const fs = require('fs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretToken = process.env.TOKEN;

// créer un commentaire
exports.createComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  models.User.findOne({ where: { id: decodedToken.userId } }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'TOKEN' });
    }
    models.Post.findOne({ where: { id: req.params.postid } })
      .then((post) => {
        if (!post) {
          return res.status(404).json({ error: 'POST NOT FOUND' });
        }

        let content = req.body.content;

        models.Comment.create({
          content: content,
          user_id: user.id,
          post_id: post.id,
        })
          .then(() => res.status(201).json())
          .catch((error) => res.status(500).json({ error: 'A - ' + error }));
      })
      .catch((error) => res.status(500).json({ error: 'B - ' + error }));
  });
};

// modifier un commentaire
exports.modifyComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      models.Comment.findOne({ where: { id: req.params.id } })
        .then((comment) => {
          if (!comment) {
            return res.status(404).json({ error: 'COMMENT NOT FOUND' });
          }

          let content = req.body.content ? req.body.content : comment.content;

          if (user.id == comment.user_id || user.isAdmin == 1) {
            comment
              .update({
                content: content,
                updatedAt: Date.now(),
              })
              .then(() => res.status(200).json())
              .catch((error) =>
                res.status(500).json({ error: 'A - ' + error })
              );
          } else {
            return res.status(401).json({ error: 'AUTHORIZATION' });
          }
        })
        .catch((error) => res.status(500).json({ error: 'B - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'C - ' + error }));
};

// supprimer un commentaire
exports.deleteComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      models.Comment.findOne({ where: { id: req.params.id } })
        .then((comment) => {
          if (!comment) {
            return res.status(404).json({ error: 'COMMENT NOT FOUND' });
          }

          if (user.id == comment.user_id || user.isAdmin == 1) {
            models.Comment.destroy({ where: { id: req.params.id } })
              .then(() => res.status(200).json())
              .catch((error) =>
                res.status(500).json({ error: 'A - ' + error })
              );
          } else {
            return res.status(401).json({ error: 'AUTHORIZATION' });
          }
        })
        .catch((error) => res.status(500).json({ error: 'B - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'C - ' + error }));
};

// récupérer un commentaire
exports.getOneComment = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      models.Comment.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: models.User,
            attributes: [
              'id',
              'firstName',
              'lastName',
              'profilePicture',
              'isAdmin',
            ],
            where: { id: { [Op.col]: 'Comment.user_id' } },
          },
          {
            model: models.Post,
            attributes: [
              'content',
              'attachment',
              'nbOfLikes',
              'user_id',
              'createdAt',
              'updatedAt',
            ],
            where: { id: { [Op.col]: 'Comment.post_id' } },
            include: {
              model: models.User,
              attributes: ['firstName', 'lastName', 'profilePicture'],
            },
          },
        ],
      })
        .then((comments) => {
          if (!comments) {
            return res.status(404).json({ error: 'COMMENT NOT FOUND' });
          }
          res.status(200).send(comments);
        })
        .catch((error) => res.status(500).json({ error: 'A - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'B - ' + error }));
};
