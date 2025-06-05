import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { message, Button, Input, Form, Typography } from 'antd';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { getQuestionWithAnswers, createAnswer, deleteQuestion, deleteAnswer } from '../api/forumService';
import './styles/QuestionDetail.css';
import { useAuth } from '../contexts/AuthContext';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerForm] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    loadQuestionDetails();
  }, [questionId]);

  const loadQuestionDetails = async () => {
    setLoading(true);
    try {
      const data = await getQuestionWithAnswers(questionId);
      setQuestion(data.question);
      setAnswers(data.answers);
    } catch (error) {
      console.error('Error loading question details:', error);
      message.error('Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnswer = async (values) => {
    try {
      await createAnswer(questionId, values.content);
      message.success('Answer posted successfully!');
      answerForm.resetFields();
      loadQuestionDetails(); // Refresh questions and answers
    } catch (error) {
      message.error(error.message || 'Failed to post answer');
    }
  };

  const handleDeleteQuestion = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId);
        message.success('Question deleted successfully');
        navigate(`/forum/subject/${question.subject_id}`);
      } catch (error) {
        message.error(error.message || 'Failed to delete question');
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      try {
        await deleteAnswer(answerId);
        message.success('Answer deleted successfully');
        loadQuestionDetails(); // Refresh answers list
      } catch (error) {
        message.error(error.message || 'Failed to delete answer');
      }
    }
  };

  if (loading) {
    return <div>Loading question...</div>; // Basic loading state
  }

   if (!question) {
    return <div>Question not found.</div>; // Basic not found state
  }

  return (
    <div className="question-detail-page" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      <Breadcrumb /> {/* Breadcrumb should handle this path */}

      <section className="question-content-section glassy">
        <Title level={2} className="question-title">{question.title}</Title>
        <Text type="secondary" className="question-meta">Posted by {question.author_email} on {new Date(question.created_at).toLocaleDateString()}</Text>
        <div className="question-full-content">
          {question.content}
        </div>
        {/* Reactions Section (To be implemented) */}
        {/* <div>Reactions Placeholder</div> */}
        {(user?.id === question.user_id || user?.role === 'admin') && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteQuestion}
            className="delete-question-btn"
            title="Delete Question"
          />
        )}
      </section>

      <section className="answers-section">
         <Title level={3} className="answers-title">Answers ({answers.length})</Title>
        
        {answers.length > 0 ? (
          <AnimatePresence>
            <div className="answers-list-container">
              {answers.map(answer => (
                <motion.div
                  key={answer.id}
                  className="answer-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="answer-author">{answer.author_email}</div>
                  <div className="answer-content">{answer.content}</div>
                  <div className="answer-meta">{new Date(answer.created_at).toLocaleString()}</div>
                   {/* Reactions on Answers (To be implemented) */}
                   {/* <div>Answer Reactions Placeholder</div> */}
                    {(user?.id === answer.user_id || user?.role === 'admin') && (
                       <Button
                         type="text"
                         danger
                         icon={<DeleteOutlined />}
                         onClick={() => handleDeleteAnswer(answer.id)}
                         className="delete-answer-btn"
                         title="Delete Answer"
                       />
                     )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="no-answers">
            <Text>No answers yet. Be the first to respond!</Text>
          </div>
        )}
      </section>

      <section className="post-answer-section glassy">
         <Title level={4} className="post-answer-title">Post Your Answer</Title>
        <Form
          form={answerForm}
          layout="vertical"
          onFinish={handleCreateAnswer}
        >
          <Form.Item
            label="Your Answer"
            name="content"
            rules={[{ required: true, message: 'Please enter your answer!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Answer
            </Button>
          </Form.Item>
        </Form>
      </section>

      {/* Add a basic footer */}
       <footer className="forum-footer glassy"> {/* Reusing forum-footer class */}
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

export default QuestionDetail; 