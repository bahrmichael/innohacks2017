import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

    api.post('/init/', (req, res) => {
		res.status(201)
		res.send('created!')
    })

    api.get ('/languages/', (req, res) => res.send(['German', 'English']))

    api.put ('/learner/:language/', (req, res) => {
        res.json({
            languageName: req.params.language
        })
    })

    api.get ('/frequency-words/translate/', (req, res) => {
        res.status(200)
        res.send('this is the mock Frequency Word')
    })

    api.get ('/frequency-words/repeat/', (req, res) => {
        res.status(200)
        res.send('Ich wiederhole für dich das Frequenz Wort, Subjekt')
    })

    api.get ('/frequency-words/', (req, res) => {
        res.send('Das ist ein gemocktes Frequenz Wort.')
    })


    api.post ('/frequency-words/:answer', (req, res) => {
        var ok = '';
        if (req.params.answer === 'ok'){
            ok = 'y'
        }else if (req.params.answer === 'notok'){
            ok = 'n'
        }
        res.json({ answer: req.params.answer, some: ok })
    })

    api.get ('/onboarding-completed/', (req, res) => {
        res.status(200)
        res.send('204')
    })


    api.get ('/sentence/translate/', (req, res) => {
        res.status(200)
        res.send('translated mock sentence')
    })

    api.get ('/sentence/repeat/', (req, res) => {
        res.status(200)
        res.send('Wiederholter Satz')
    })

    api.get ('/sentence/', (req, res) => {
        res.status(200)
        res.send('Gemockter Satz')
    })

    api.post ('/sentence/:answer/', (req, res) => {
        var ok = '';
        if (req.params.answer === 'ok'){
            ok = 'y'
        }else if (req.params.answer === 'notok'){
            ok = 'n'
        }
        res.json({ answer: req.params.answer, some: ok })
    })

	return api;
}
