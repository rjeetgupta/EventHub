// app/contact/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, HelpCircle, Moon, Sun, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  const [isDark, setIsDark] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@eventhub.edu',
      link: 'mailto:support@eventhub.edu',
      description: 'We typically respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 (800) 123-4567',
      link: 'tel:+918001234567',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM IST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Ranchi, Jharkhand, India',
      link: '#',
      description: 'Main Campus Administration'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'event', label: 'Event Related', icon: Sparkles },
    { value: 'feedback', label: 'Feedback', icon: CheckCircle }
  ];

  const faqs = [
    {
      question: 'How do I register for an event?',
      answer: 'Simply browse events, click on the one you like, and hit the Register button. You\'ll receive instant confirmation.'
    },
    {
      question: 'Can I create events as a student?',
      answer: 'Event creation is available for Group Admins. If you want to organize an event, contact your department coordinator.'
    },
    {
      question: 'How do I download my certificate?',
      answer: 'After attending an event, visit "My Events" and click the Download Certificate button for eligible events.'
    },
    {
      question: 'What if I miss an event I registered for?',
      answer: 'Your registration status will show as "Missed" and certificates won\'t be available for that event.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 px-4 py-2">
            <MessageSquare className="w-4 h-4 mr-2 inline" />
            Get In Touch
          </Badge>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              We're Here to
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300">
              Help You
            </span>
          </h1>
          
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about EventHub? Need technical support? Want to share feedback? We'd love to hear from you!
          </p>
        </section>

        {/* Contact Info Cards */}
        <section className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;
            return (
              <Card 
                key={i}
                className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-orange-500 transition-colors duration-300">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a 
                    href={info.link}
                    className="text-lg font-semibold text-orange-500 hover:text-orange-600 transition-colors block"
                  >
                    {info.content}
                  </a>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Main Content Grid */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-500">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      className="border-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Button
                            key={cat.value}
                            type="button"
                            variant={formData.category === cat.value ? 'default' : 'outline'}
                            onClick={() => handleInputChange('category', cat.value)}
                            className={
                              formData.category === cat.value
                                ? 'bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                                : 'border-orange-500/30 hover:bg-orange-500/10'
                            }
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {cat.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      className="border-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6 text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <HelpCircle className="w-6 h-6 text-orange-500" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Quick answers to common questions
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300 cursor-pointer"
                  >
                    <h4 className="font-semibold mb-2 text-orange-500">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-linear-to-br from-orange-500/5 to-amber-500/5">
              <CardContent className="p-6 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-orange-500 mx-auto animate-pulse" />
                <h3 className="text-xl font-bold">Can't Find Your Answer?</h3>
                <p className="text-muted-foreground">
                  Our support team is here to help! Fill out the form and we'll get back to you quickly.
                </p>
                <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                  Average response time: 24 hours
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Office Hours Card */}
        <section>
          <Card className="border-orange-500/20 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold">Office Hours</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our support team is available during business hours to assist you with any questions or concerns.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Monday - Friday</span>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      9:00 AM - 6:00 PM
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Saturday</span>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      10:00 AM - 2:00 PM
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Sunday</span>
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                      Closed
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}