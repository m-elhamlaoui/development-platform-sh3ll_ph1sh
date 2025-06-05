const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.ENUM('PDF', 'Video', 'Audio', 'Document', 'Other'),
      allowNull: false,
      defaultValue: 'Document'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storedFileName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    }
  });

  // Add associations
  File.associate = (models) => {
    File.belongsTo(models.User, {
      foreignKey: 'uploadedBy',
      as: 'uploader'
    });
    File.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject'
    });
  };

  return File;
}; 