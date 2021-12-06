// Dépendances
const models = require('../models');
const fs = require('fs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretToken = process.env.TOKEN;

// Création d'un post
exports.createPost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }

      let content = req.body.content;
      let attachment = req.file
        ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        : null;

      // créer le post
      models.Post.create({
        content: content,
        attachment: attachment,
        user_id: user.id,
      })
        .then(() => res.status(201).json())
        .catch((error) => res.status(500).json({ error: 'A - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'B - ' + error }));
};

// Modification d'un post
exports.modifyPost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que le post recherché existe
      models.Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: 'POST NOT FOUND' });
          }

          let content = req.body.content ? req.body.content : post.content;
          let attachment = req.file
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            : post.attachment;

          // vérifier que l'user est l'auteur du post OU est admin
          if (user.id == post.user_id || user.isAdmin == 1) {
            // mettre à jour le post
            post
              .update({
                content: content,
                attachment: attachment,
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

// Suppression d'un post
exports.deletePost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que le post recherché existe
      models.Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: 'POST NOT FOUND' });
          }

          // vérifier que l'user est l'auteur du post OU est admin
          if (user.id == post.user_id || user.isAdmin == 1) {
            // supprimer les commentaires associés au post
            models.Comment.destroy({ where: { post_id: post.id } })
              .then(() => {
                let filename = post.attachment
                  ? post.attachment.split('/images/')[1]
                  : null;
                fs.unlink(`images/${filename}`, () => {
                  // supprimer les likes associés au post
                  models.Like.destroy({ where: { post_id: post.id } })
                    .then(() => res.status(200).json())
                    .catch((error) =>
                      res.status(500).json({ error: 'A - ' + error })
                    );
                  // supprimer le post recherché
                  post
                    .destroy()
                    .then(() => res.status(200).json())
                    .catch((error) =>
                      res.status(500).json({ error: 'B - ' + error })
                    );
                });
              })
              .catch((error) =>
                res.status(500).json({ error: 'C - ' + error })
              );
          } else {
            return res.status(401).json({ error: 'AUTHORIZATION' });
          }
        })
        .catch((error) => res.status(500).json({ error: 'D - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'E - ' + error }));
};

// Obtention de tous les posts
exports.getAllPosts = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que des posts ont déjà été publiés
      models.Post.count()
        .then((nbOfPosts) => {
          if (nbOfPosts === 0) {
            return res.status(404).json({ error: 'POST NOT FOUND' });
          }
          // trouver tous les posts
          models.Post.findAll({
            include: [
              {
                model: models.User,
                attributes: [
                  'firstName',
                  'lastName',
                  'profilePicture',
                  'isAdmin',
                  'createdAt',
                  'updatedAt',
                ],
                where: { id: { [Op.col]: 'Post.user_id' } },
              },
              {
                model: models.Comment,
                attributes: [
                  'id',
                  'content',
                  'user_id',
                  'post_id',
                  'createdAt',
                  'updatedAt',
                ],
                where: { post_id: { [Op.col]: 'Post.id' } },
                include: {
                  model: models.User,
                  attributes: ['firstName', 'lastName', 'profilePicture'],
                },
                required: false,
              },
            ],
            order: [['createdAt', 'ASC']],
          })
            .then((posts) => {
              res.status(200).send(posts);
            })
            .catch((error) => res.status(500).json({ error: 'A - ' + error }));
        })
        .catch((error) => res.status(500).json({ error: 'B - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'C - ' + error }));
};

// Obtention d'un post
exports.getOnePost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // récupérer le post recherché
      models.Post.findOne({
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
              'createdAt',
              'updatedAt',
            ],
            where: { id: { [Op.col]: 'Post.user_id' } },
          },
          {
            model: models.Comment,
            attributes: [
              'id',
              'content',
              'user_id',
              'post_id',
              'createdAt',
              'updatedAt',
            ],
            where: { post_id: { [Op.col]: 'Post.id' } },
            include: {
              model: models.User,
              attributes: ['firstName', 'lastName', 'profilePicture'],
            },
            required: false,
          },
        ],
      })
        // vérifier que le post existe
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: 'POST NOT FOUND' });
          }
          res.status(200).send(post);
        })
        .catch((error) => res.status(500).json({ error: 'A - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'B - ' + error }));
};

exports.getAllLikesFromPost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que l'user recherché existe
      models.Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
          if (!post) {
            return res.status(404).json({ error: 'POST NOT FOUND' });
          }
          models.Like.count({ where: { post_id: req.params.id } })
            .then((nbOfLikes) => {
              if (nbOfLikes === 0) {
                return res.status(404).json({ error: 'LIKES NOT FOUND' });
              }
              models.Like.findAll({
                where: { post_id: req.params.id },
                attributes: [
                  'id',
                  'user_id',
                  'post_id',
                  'createdAt',
                  'updatedAt',
                ],
                include: {
                  model: models.User,
                  attributes: [
                    'firstName',
                    'lastName',
                    'profilePicture',
                    'createdAt',
                    'updatedAt',
                  ],
                  where: { id: { [Op.col]: 'Like.user_id' } },
                },
                order: [['createdAt', 'ASC']],
              })
                .then((likes) => {
                  res.status(200).send(likes);
                })
                .catch((error) =>
                  res.status(500).json({ error: 'A - ' + error })
                );
            })
            .catch((error) => res.status(500).json({ error: 'B - ' + error }));
        })
        .catch((error) => res.status(500).json({ error: 'C - ' + error }));
    })
    .catch((error) => res.status(500).json({ error: 'D - ' + error }));
};
