// Dépendances
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const models = require('../models');
const { Op } = require('sequelize');
require('dotenv').config();

const secretToken = process.env.TOKEN;

// Regex
const textRegex = /^[A-Za-z]{2,}$/;
const emailRegex = /^[A-Za-z0-9_.+-]+\@[A-Za-z0-9_.+-]+\.[A-Za-z]+$/;
const passwordRegex = /[\w]{8,24}/;

// Inscription
exports.signup = (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!textRegex.test(firstName)) {
    return res
      .status(400)
      .json({ error: 'Le prénom doit contenir uniquement des lettres' });
  }
  if (!textRegex.test(lastName)) {
    return res.status(400).json({
      error: 'Le nom de famille doit contenir uniquement des lettres',
    });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error:
        "Veuillez écrire l'adresse e-mail avec cette syntaxe: exemple@exemple.com",
    });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Le mot de passe doit contenir entre 8 et 24 caractères',
    });
  }

  models.User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return res
          .status(401)
          .json({ error: 'Un compte avec cette adresse e-mail existe déjà' });
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            models.User.create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hash,
            })
              .then(() => res.status(201).json())
              .catch((err) => res.status(400).json({ error: 'A - ' + err }));
          })
          .catch((err) => res.status(500).json({ error: 'B - ' + err }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'C - ' + err }));
};

// Login
exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  models.User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "L'adresse e-mail n'existe pas" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect' });
            } else {
              return res.status(201).json({
                userId: user.id,
                token: jwt.sign({ userId: user.id }, secretToken, {
                  expiresIn: '24h',
                }),
              });
            }
          })
          .catch((err) => res.status(500).json({ error: 'A - ' + err }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'B - ' + err }));
};

// Modification d'un user
exports.modifyUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user1) => {
      if (!user1) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // trouver l'user recherché
      models.User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ error: 'USER NOT FOUND' });
          }

          let firstName = req.body.firstName
            ? req.body.firstName
            : user.firstName;
          let lastName = req.body.lastName ? req.body.lastName : user.lastName;
          let profilePicture = req.file
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            : user.profilePicture;
          let jobTitle = req.body.jobTitle ? req.body.jobTitle : user.jobTitle;
          let biography = req.body.biography
            ? req.body.biography
            : user.biography;
          let birthday = req.body.birthday ? req.body.birthday : user.birthday;

          // vérifier que l'user a les autorisations OU est admin
          if (user.id == decodedToken.userId || user1.isAdmin == 1) {
            // update des infos de l'user
            user
              .update({
                firstName: firstName,
                lastName: lastName,
                profilePicture: profilePicture,
                jobTitle: jobTitle,
                biography: biography,
                birthday: birthday,
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

// Suppression d'un user
exports.deleteUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user1) => {
      if (!user1) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que l'user est connecté
      models.User.findOne({ where: { id: req.params.id } }).then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'USER NOT FOUND' });
        }
        // vérifier que l'user a les autorisations OU est admin
        if (user.id == decodedToken.userId || user1.isAdmin == 1) {
          // récupérer les posts de l'user
          models.Post.findAll({ where: { user_id: user.id } })
            .then((posts) => {
              posts.forEach((post) => {
                models.Comment.destroy({
                  where: {
                    [Op.or]: [{ post_id: post.id }, { user_id: user.id }],
                  },
                })
                  .then(() => res.status(200).json())
                  .catch((error) =>
                    res.status(500).json({ error: 'A - ' + error })
                  );
                models.Like.destroy({
                  where: {
                    [Op.or]: [{ post_id: post.id }, { user_id: user.id }],
                  },
                })
                  .then(() => res.status(200).json())
                  .catch((error) =>
                    res.status(500).json({ error: 'B - ' + error })
                  );
              });
              models.Post.destroy({
                where: { user_id: user.id },
              })
                .then(() => res.status(200).json())
                .catch((error) =>
                  res.status(500).json({ error: 'C - ' + error })
                );
            })
            .catch((error) => res.status(500).json({ error: 'D - ' + error }));

          let filename = user.profilePicture
            ? user.profilePicture.split('/images/')[1]
            : null;
          fs.unlink(`images/${filename}`, () => {
            user
              .destroy({ where: { user_id: user.id } })
              .then(() => res.status(200).json())
              .catch((error) =>
                res.status(500).json({ error: 'E - ' + error })
              );
          });
        } else {
          return res.status(401).json({ error: 'AUTHORIZATION' });
        }
      });
    })
    .catch((error) => res.status(500).json({ error: 'F - ' + error }));
};

// Obtention d'un user
exports.getOneUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'TOKEN' });
    }
    // trouver l'user recherché
    models.User.findOne({
      attributes: [
        'id',
        'email',
        'firstName',
        'lastName',
        'profilePicture',
        'biography',
        'jobTitle',
        'birthday',
        'createdAt',
        'updatedAt',
        'isAdmin',
      ],
      where: { id: req.params.id },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'USER NOT FOUND' });
        }
        res.status(200).send(user);
      })
      .catch((err) => res.status(500).json({ error: 'A - ' + err }));
  });
};

// Obtention de tous les users
exports.getAllUsers = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  models.User.findOne({ where: { id: decodedToken.userId } }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'TOKEN' });
    }
    models.User.count().then((nbOfUsers) => {
      if (nbOfUsers === 0) {
        return res.status(404).json({ error: 'USER NOT FOUND' });
      }
      models.User.findAll({
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'profilePicture',
          'biography',
          'jobTitle',
          'birthday',
          'createdAt',
          'updatedAt',
          'isAdmin',
        ],
        order: [['createdAt', 'ASC']],
      })
        .then((users) => {
          res.status(200).send(users);
        })
        .catch((error) => res.status(400).json({ error: 'A - ' + error }));
    });
  });
};

// Obtention de tous les posts d'un user
exports.getAllPostsFromUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que l'user recherché existe
      models.User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ error: 'USER NOT FOUND' });
          }
          // vérifier que l'user a publié des posts
          models.Post.count({ where: { user_id: req.params.id } })
            .then((nbOfPosts) => {
              if (nbOfPosts === 0) {
                return res.status(404).json({ error: 'POSTS NOT FOUND' });
              }
              // trouver tous les posts de l'user
              models.Post.findAll({
                where: { user_id: req.params.id },
                attributes: [
                  'id',
                  'content',
                  'attachment',
                  'nbOfLikes',
                  'user_id',
                  'createdAt',
                  'updatedAt',
                ],
                include: [
                  {
                    model: models.User,
                    attributes: ['firstName', 'lastName', 'profilePicture'],
                    where: {
                      id: { [Op.col]: 'Post.user_id' },
                    },
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
                    where: {
                      post_id: { [Op.col]: 'Post.id' },
                    },
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

// Obtention de tous les posts d'un user
exports.getAllLikesFromUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretToken);

  // vérifier que l'user est connecté
  models.User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'TOKEN' });
      }
      // vérifier que l'user recherché existe
      models.User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ error: 'USER NOT FOUND' });
          }
          // vérifier que l'user a liké des posts
          models.Like.count({ where: { user_id: req.params.id } })
            .then((nbOfLikes) => {
              if (nbOfLikes === 0) {
                return res.status(404).json({ error: 'LIKES NOT FOUND' });
              }
              // trouver tous les likes de l'user
              models.Like.findAll({
                where: { user_id: req.params.id },
                attributes: ['id', 'user_id', 'post_id', 'createdAt'],
                include: [
                  {
                    model: models.User,
                    attributes: ['firstName', 'lastName', 'profilePicture'],
                    where: {
                      id: { [Op.col]: 'Like.user_id' },
                    },
                  },
                  {
                    model: models.Post,
                    attributes: [
                      'id',
                      'content',
                      'attachment',
                      'nbOfLikes',
                      'user_id',
                      'createdAt',
                      'updatedAt',
                    ],
                    where: {
                      id: { [Op.col]: 'Like.post_id' },
                    },
                    include: {
                      model: models.User,
                      attributes: ['firstName', 'lastName', 'profilePicture'],
                    },
                    required: false,
                  },
                ],
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
