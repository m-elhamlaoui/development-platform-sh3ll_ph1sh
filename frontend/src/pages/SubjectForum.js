import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { message, Button, Modal, Input, Form } from 'antd';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { getQuestionsBySubject, createQuestion, deleteQuestion } from '../api/forumService';
import { getSubjects } from '../api/subjectService'; // Needed to get subject name for Breadcrumb/title
import './styles/SubjectForum.css';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { DeleteOutlined } from '@ant-design/icons'; // Import icon

const SubjectForum = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState(null); // To store subject details
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth(); // Import user from useAuth

  useEffect(() => {
    loadSubjectDetails(subjectId);
    loadQuestions(subjectId);
  }, [subjectId]);

  const loadSubjectDetails = async (id) => {
    try {
      const data = await getSubjects(); // Fetch all subjects
      const foundSubject = data.find(s => s.id === parseInt(id)); // Find the one matching the ID
      if (foundSubject) {
        setSubject(foundSubject);
      } else {
        message.error('Subject not found');
        // Optionally navigate back or to a 404 page
      }
    } catch (error) {
      message.error('Error loading subject details');
    }
  };

  const loadQuestions = async (id) => {
    setLoading(true);
    try {
      const data = await getQuestionsBySubject(id);
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      message.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuestionClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateQuestion = async (values) => {
    try {
      await createQuestion(subjectId, values.title, values.content);
      message.success('Question posted successfully!');
      setIsModalVisible(false);
      form.resetFields();
      loadQuestions(subjectId); // Refresh the questions list
    } catch (error) {
      message.error(error.message || 'Failed to post question');
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/forum/question/${questionId}`);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId);
        message.success('Question deleted successfully');
        loadQuestions(subjectId); // Refresh the questions list
      } catch (error) {
        message.error(error.message || 'Failed to delete question');
      }
    }
  };

  return (
    <div className="subject-forum-page" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      {/* Use subject name in breadcrumb if available */}
      <Breadcrumb />

      <section className="forum-subject-header glassy">
        {subject ? (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="forum-subject-title"
          >
            Forum: {subject.name}
          </motion.h2>
        ) : (
          <motion.h2>Loading Subject...</motion.h2>
        )}

        <Button type="primary" onClick={handleNewQuestionClick}>
          Post a New Question
        </Button>
      </section>

      <section className="forum-questions-list">
        {loading ? (
          <div>Loading questions...</div>
        ) : questions.length > 0 ? (
          <AnimatePresence>
            <div className="questions-list-container">
              {questions.map(question => (
                <motion.div
                  key={question.id}
                  className="question-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <h3>{question.title}</h3>
                  <p className="question-meta">Posted by {question.author_email} on {new Date(question.created_at).toLocaleDateString()}</p>
                  <p className="question-content">{question.content}</p>
                  {/* Delete button for author or admin */}
                  {(user?.id === question.user_id || user?.role === 'admin') && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        handleDeleteQuestion(question.id);
                      }}
                      className="delete-question-btn"
                      title="Delete Question"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="no-questions">
            <p>No questions posted yet for this subject.</p>
            <Button type="primary" onClick={handleNewQuestionClick}>
              Be the first to ask!
            </Button>
          </div>
        )}
      </section>

      <Modal
        title="Post a New Question"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null} // Use custom footer with form submit button
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuestion}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the question title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter the question content!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Post Question
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add a basic footer (can be a shared component later) */}
      <footer className="forum-footer glassy">
        <div className="footer-content">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} eduINPT. All rights reserved.
          </div>
          <div className="footer-right">
            <a href="#legal" className="footer-link">Legal Notice</a>
            <span className="footer-sep">|</span>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default SubjectForum; 