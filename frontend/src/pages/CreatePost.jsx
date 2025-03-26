import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPromt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if(form.prompt){
      try {
        setGeneratingImg(true);
        const respone = await fetch ('http://localhost:8080/api/v1/dalle',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({prompt: form.prompt}),
        })

        const data = await respone.json();

        setForm({...form, photo:`data:image/jpeg;base64,${data.photo}`})

      } catch (error) {
        alert(error)
      }finally{
        setGeneratingImg(false);
      }
    }else{
      alert('Enter a prompt')
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(form.prompt && form.photo){
      setLoading(true);
      try {
        const respone = await fetch('http://localhost:8080/api/v1/post',
        {
          method: 'POST',
          headers:{
            'Content-type' : 'application/json',
          },
          body: JSON.stringify(form)
        })

        await respone.json();
        navigate('/');
      } catch (error) {
        alert(error)
      }finally{
        setLoading(false);
      }
    }
    else{
      alert('please enter a prompt');
    }
  };

  const handleChange = (e) => 
  { setForm({ ...form, [e.target.name]: e.target.value });
  }
  const handleSurpriseMe = () => {
    const randomPromt = getRandomPromt(form.prompt);
    setForm({ ...form, prompt: randomPromt });
  };

  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1>Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Create imaginative and visually stunning images generator by DALL -E
          AI and share them with the Communtiy
        </p>
      </div>

      <form className="mt-16 max-w-3x1" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            LabelName="Your name"
            type="text"
            name="name"
            placeholder="Ajay"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A plush toy robot sitting against a yellow wall"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full 0bject-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 objct-contain opacity-40 "
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justif-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mat-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created image you want, you can share with others
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "sharing..." : "share with community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;